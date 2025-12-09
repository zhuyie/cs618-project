let navigateFn = null

export function setNavigate(fn) {
  console.log('setting navigateFn')
  navigateFn = fn
}

export function navigate(...args) {
  if (navigateFn) {
    return navigateFn(...args)
  }
  console.warn('navigate not initialized yet')
}
