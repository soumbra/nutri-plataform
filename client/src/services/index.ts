// Services exports
export { BaseService } from './base.service'
export { ContractService } from './contract.service'
export { FoodService } from './food.service'
export { MealPlanService } from './meal-plan.service'
export { NutritionistService } from './nutritionist.service'

// Re-export types for convenience
export type { PaginationResult } from './base.service'
export type {
  Food,
  CreateFoodData,
  UpdateFoodData,
  FoodFilters,
  NutritionalSearch
} from './food.service'

export type {
  MealPlan,
  Meal,
  MealFood,
  CreateMealPlanData,
  UpdateMealPlanData,
  CreateMealData,
  MealPlanFilters,
  CopyPlanOptions,
  NutritionalLimits,
  PlanStatistics
} from './meal-plan.service'