import { Injectable } from '@nestjs/common';

@Injectable()
export class FaqsService {
  private faqs = [];

  addFaq(faqDto) {
    const newFaq = { id: Date.now(), ...faqDto };
    this.faqs.push(newFaq);
    return newFaq;
  }
}
