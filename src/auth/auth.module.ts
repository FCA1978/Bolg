import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEntity } from './entities/auth.entity';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
