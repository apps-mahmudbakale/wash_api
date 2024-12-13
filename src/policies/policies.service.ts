import { Injectable } from '@nestjs/common';

@Injectable()
export class PoliciesService {
  private policies = [];

  addPolicy(policyDto) {
    const newPolicy = { id: Date.now(), ...policyDto };
    this.policies.push(newPolicy);
    return newPolicy;
  }
}
