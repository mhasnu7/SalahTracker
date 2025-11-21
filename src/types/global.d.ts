// This file augments the NodeJS namespace to include Timeout and Interval types.
// These types are often missing in React Native environments, leading to TypeScript errors.
declare namespace NodeJS {
  interface Timeout {}
  interface Timer {}
  interface Immediate {}
}