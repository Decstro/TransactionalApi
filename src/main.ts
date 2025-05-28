import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DatabaseSeeder } from './database/seeders/database.seeder';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Run database seeds if RUN_SEEDS is true
  if (process.env.RUN_SEEDS === 'true') {
    console.log('🌱 Running database seeds...');
    const seeder = app.get(DatabaseSeeder);
    await seeder.run();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(helmet());
  app.enableCors({
    origin: process.env.FRONTEND_URL,
  });

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
