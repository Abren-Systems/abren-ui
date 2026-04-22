import type { TaxRuleDTO, TaxCalculationResponse, TaxGroupDTO } from './api.types'
import type {
  TaxRule,
  TaxCalculationResult,
  TaxType,
  TaxGroup,
  TaxDirection,
  CalculationMethod,
} from '../domain/tax.types'
import { CommonMapper } from '@/shared/infrastructure/mappers'
import type { TaxRuleId, AccountId, TaxGroupId } from '@/shared/types/brand.types'
import { Money } from '@/shared/domain/money'

export class TaxMapper {
  static toTaxRule(dto: TaxRuleDTO): TaxRule {
    return {
      id: CommonMapper.toBrandedId<TaxRuleId>(dto.id),
      name: dto.name,
      rate: Number(dto.rate),
      taxType: dto.tax_type as TaxType,
      direction: dto.direction as TaxDirection,
      glAccountId: CommonMapper.toBrandedId<AccountId>(dto.gl_account_id),
      isActive: dto.is_active,
    }
  }

  static toTaxGroup(dto: TaxGroupDTO): TaxGroup {
    return {
      id: CommonMapper.toBrandedId<TaxGroupId>(dto.id),
      name: dto.name,
      method: dto.method as CalculationMethod,
      ruleIds: dto.rule_ids.map((id) => CommonMapper.toBrandedId<TaxRuleId>(id)),
      rules: dto.rules?.map((r) => TaxMapper.toTaxRule(r)),
      isActive: dto.is_active,
    }
  }

  static toCalculationResult(dto: TaxCalculationResponse): TaxCalculationResult {
    const result: TaxCalculationResult = {
      net: CommonMapper.toMoney(dto.net, dto.currency),
      tax: CommonMapper.toMoney(dto.tax, dto.currency),
      gross: CommonMapper.toMoney(dto.gross, dto.currency),
    }

    if (dto.breakdown) {
      result.breakdown = {}
      for (const [key, value] of Object.entries(dto.breakdown)) {
        result.breakdown[key] = CommonMapper.toMoney(value, dto.currency)
      }
    }

    return result
  }
}
