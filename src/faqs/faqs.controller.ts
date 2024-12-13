import { Controller, Post, Body } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { FaqsService } from './faqs.service';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Post()
  addFaq(@Body() createFaqDto: CreateFaqDto) {
    return this.faqsService.addFaq(createFaqDto);
  }
}
