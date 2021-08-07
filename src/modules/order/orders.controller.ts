import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UseGuards,
  Request,
  Res,
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateOrderDto } from "src/dto/order/CreateOrder.dto";
import { UpdateOrderDto } from "src/dto/order/UpdateOrder.dto.";
import { Order } from "src/entities/order/order.entity";
import { GetRequest } from "../account/dto/GetRequest.dto";
import { OrdersService } from "./orders.service";
import { CartProduct } from "src/interfaces/cartproduct.interface";
import { Pagination } from "nestjs-typeorm-paginate";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Reflector } from "@nestjs/core";
const stripe = require("stripe")(
  process.env.STRIPE_KEY
);
import { v4 as uuid } from "uuid";
import { AprioriProductsArrayDto } from "./dto/apriori-products.dto";

@ApiTags("Order")
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @SetMetadata("roles", ["StoreManager", "Salescleck"])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get("/id/:id")
  async getOne(@Param("id", ParseIntPipe) id: number): Promise<Order> {
    return await this.ordersService.getById(id);
  }

  @SetMetadata("roles", ["OperationStaff"])
  @Get("/apriori-orders")
  @ApiOkResponse({})
  getAprioriOrders(@Query() model: AprioriProductsArrayDto): Promise<any> {
    return this.ordersService.getTransactionsApriori(model);
  }

  @Get("/promotion/:id")
  async getPromotion(
    @Param("id", ParseIntPipe) coupon: number,
    @Query("total") total: number = 0
  ): Promise<Order> {
    return await this.ordersService.getPromotion(total, coupon);
  }

  @SetMetadata("roles", ["StoreManager", "Salescleck"])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get("/paginateOrders")
  async index(
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 10,
    @Query('id', ParseIntPipe) id: number,
    @Request() req
  ): Promise<Pagination<Order>> {
    limit = limit > 100 ? 100 : limit;
    if (req.user.role == "Salescleck") {
      return this.ordersService.paginate(
        {
          page,
          limit,
          route: "/api/orders/paginateOrders",
        },
        req.user.userId
      );
    }
    else {
      return this.ordersService.paginate(
        {
          page,
          limit,
          route: "/api/orders/paginateOrders",
        },
        id
      );
    }
  }

  @Get("/paginateOrdersBySession")
  async paginateBySession(
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 10,
    @Query("key") key: string = ""
  ): Promise<Pagination<Order>> {
    limit = limit > 100 ? 100 : limit;
    return this.ordersService.paginateBySession(key, {
      page,
      limit,
      route: "/api/orders/paginateOrders",
    });
  }

  @Get()
  @ApiOkResponse({})
  getCustomers(@Query() model: GetRequest): Promise<any> {
    return this.ordersService.getOrders(model);
  }

  @SetMetadata("roles", ["StoreManager", "Salescleck"])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Post()
  async createOrder(
    @Body() model: { order: CreateOrderDto; cartproducts: CartProduct[] },
    @Request() req
  ): Promise<Order> {
    return this.ordersService.createOrder(
      req.user.userId,
      model.order,
      model.cartproducts
    );
  }

  @Put("/:id")
  async updateOrder(
    @Param("id", ParseIntPipe) id: number,
    @Body() model: UpdateOrderDto
  ): Promise<Order> {
    return this.ordersService.updateOrder(id, model);
  }

  @Delete("/:id")
  deleteOrder(@Param("id", ParseIntPipe) id: number): Promise<boolean> {
    return this.ordersService.deleteOrder(id, /*currentUserId*/ 1);
  }

  @Post("/create-checkout-session")
  async createCheckoutSession(@Request() req, @Res() res) {
    const YOUR_DOMAIN = "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Stubborn Attachments",
              images: ["https://i.imgur.com/EHyR2nP.png"],
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });
    res.json({ id: session.id });
  }

  @Post("/create-payment-intent/:amount")
  async createPaymentIntent(
    @Request() req,
    @Res() res,
    @Param("amount", ParseIntPipe) amount: number
  ) {
    const { items } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  }

  @Post("/payment")
  async pay(@Request() req, @Res() res) {
    const { product, token } = req.body;
    console.log("PRODUCT ", product);
    console.log("PRICE ", product.price);
    const idempontencyKey = uuid();

    return stripe.customers
      .create({
        email: token.email,
        source: token.id,
      })
      .then((customer) => {
        stripe.charges.create(
          {
            amount: product.price * 100,
            line_items: [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: "Stubborn Attachments",
                    images: ["https://i.imgur.com/EHyR2nP.png"],
                  },
                  unit_amount: 18 * 100,
                },
                quantity: 1,
              },
            ],
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping: {
              name: token.card.name,
              address: {
                country: token.card.address_country,
              },
            },
          },
          { idempontencyKey }
        );
      })
      .then((result) => res.status(200).json(result))
      .catch((err) => console.log(err));
  }
}
