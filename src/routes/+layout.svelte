<script>
// @ts-nocheck

    import "../app.pcss";
    import { ModeWatcher } from "mode-watcher";

    import { Button } from "$lib/components/ui/button";
    import Sun from "svelte-radix/Sun.svelte";
    import Moon from "svelte-radix/Moon.svelte";
    import { toggleMode } from "mode-watcher";

    import  bioicon  from "$lib/images/bioicon.png"
</script>
<ModeWatcher />


    

<div class=" fixed top-0 w-full flex flex-row items-center m-4 justify-between 
            
            ">
  <a href="https://www.bioplaster-research.com/">
    <image src={"https://assets-global.website-files.com/6329f1978ad6b01b3721ce6c/6329f45cb0a06d641db638eb_nav_logo-p-500.png"} class=" w-[250px]"/>
  </a>
  
  <p class="text-xl italic  ">
    Panel
  </p>

  <Button on:click={toggleMode} variant="outline" size="icon" class="mr-5">
    <Sun
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
  </Button>
</div>

<main class=" mt-20">
    <slot/>
</main>


