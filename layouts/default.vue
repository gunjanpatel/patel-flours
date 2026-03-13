<template>
  <div class="min-h-screen flex flex-col bg-oat">
    <NavBar />
    <CartDrawer />
    <main class="flex-1">
      <slot />
    </main>
    <FooterBar />
  </div>
</template>
