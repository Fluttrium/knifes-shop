import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions, swaggerTitle, swaggerDescription } from './common';
import cookieParser from 'cookie-parser';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration --------------------------------
  // swaggerOptions, swaggerTitle, swaggerDescription variables are customized and defined in common/swagger/swagger.config.ts
  const config = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, swaggerOptions);

  // End Swagger Configurations --------------------------------

  //Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001',
      'http://92.118.114.147:1488',
      'http://localhost:1488'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  });

  await app.listen(1488);
  console.log(`App running on Port 1488`);
}
bootstrap();
