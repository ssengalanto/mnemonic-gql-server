import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 4000;

  await app.listen(port, () => {
    console.log(`🚀 Server ready at: http://localhost:${port}/graphql`);
  });
}
bootstrap();
