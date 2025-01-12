import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { PlanService } from './plan/plan.service';
import { PlanModule } from './plan/plan.module';
import { PolicyController } from './policy/policy.controller';
import { PolicyModule } from './policy/policy.module';
import { SeederService } from './seeder/seeder.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/model/user.model';
import { Product } from './product/model/product.model';
import { Plan } from './plan/model/plan.model';
import { Policy } from './policy/model/policy.model';
import { PendingPolicy } from './policy/model/pending-policy.model';
import { UtilModule } from './util/util.module';
import configuration from './config/configuration';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: configuration().database.host,
      port: configuration().database.port,
      username: configuration().database.username,
      password: configuration().database.password,
      database: configuration().database.name,
      models: [User, Product, Plan, PendingPolicy, Policy],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
    SequelizeModule.forFeature([User, Product, Plan, PendingPolicy, Policy]),
    ProductModule,
    PlanModule,
    PolicyModule,
    UtilModule,
  ],
  controllers: [AppController, ProductController, PolicyController],
  providers: [AppService, PlanService, SeederService],
})
export class AppModule {
  constructor(private readonly seederService: SeederService) {
    this.seederService.seed();
  }
}
