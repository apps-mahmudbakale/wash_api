import { Controller, Post, Body } from '@nestjs/common';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { PoliciesService } from './policies.service';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post()
  addPolicy(@Body() createPolicyDto: CreatePolicyDto) {
    return this.policiesService.addPolicy(createPolicyDto);
  }
}
