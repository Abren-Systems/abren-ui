import type { RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'

export interface MenuItem {
  label: string
  route?: string
  href?: string
  icon?: Component | string
  permissions?: string[]
}

export interface ModuleDefinition {
  id: string
  name: string
  routes: () => Promise<RouteRecordRaw[]>
  permissions: string[]
  menuItems: MenuItem[]
}
