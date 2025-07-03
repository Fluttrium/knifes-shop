import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {swaggerOptions, swaggerTitle, swaggerDescription} from './common';
import {Logger} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');

    const config = new DocumentBuilder()
        .setTitle(swaggerTitle)
        .setDescription(swaggerDescription)
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document, swaggerOptions);

    app.enableCors();


    await app.listen(2228);

    Logger.log(`App running on Port 2228`);
}

bootstrap();
