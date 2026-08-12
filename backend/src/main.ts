import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { TenantMiddleware } from './tenant/tenant.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // ────────────────────────────────────────────────
  // 🔥 SECURITY MIDDLEWARE
  // ────────────────────────────────────────────────
  app.use(helmet());

  // ────────────────────────────────────────────────
  // 🔥 TENANT MIDDLEWARE (CRITICAL)
  // Must run BEFORE any routes, guards, pipes, etc.
  // ────────────────────────────────────────────────
  app.use(new TenantMiddleware().use);

  // ────────────────────────────────────────────────
  // 🔥 GLOBAL VALIDATION PIPE
  // ────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // ────────────────────────────────────────────────
  // 🔥 OPTIONAL: SWAGGER DOCS
  // ────────────────────────────────────────────────
  // const config = new DocumentBuilder()
  //   .setTitle('API')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('docs', app, document);

  // ────────────────────────────────────────────────
  // 🔥 START SERVER
  // ────────────────────────────────────────────────
  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
}

bootstrap();
