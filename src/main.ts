import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(helmet());
  app.enableCors();

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Transactional API')
    .setDescription('API documentation for the Transactional API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `\n🚀 Server running on: http://localhost:${process.env.PORT ?? 3000}\n`,
  );
}
void bootstrap();
