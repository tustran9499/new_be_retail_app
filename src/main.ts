import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    exposedHeaders: '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  app.enableCors(corsOptions);

  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('Retail System API')
    .setDescription('Retail system API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
