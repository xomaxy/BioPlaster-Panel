<script lang="ts">
    import Sun from "svelte-radix/Sun.svelte";
    import Moon from "svelte-radix/Moon.svelte";
    import { Button, Root } from "$lib/components/ui/button";
    import {Separator} from "$lib/components/ui/separator"
    import { Slider } from "$lib/components/ui/slider"
    import { toggleMode } from "mode-watcher";
    import {Toggle} from "$lib/components/ui/toggle"

function formatNumber(n: any){
    return String(n).replace(/(.)(?=(\d{3})+$)/g,'$1,')
}

function truncate(n: number,decimals=2){
    return Math.floor(n*10**decimals)/(10**decimals)
}

interface Toggleable{
    value: any,
    toggle: ()=> void,
    toBoolean: ()=> boolean
}

function make_toggle(t_value:any=true,f_value:any=false): Toggleable{
    function truth(value: any){
        return (value === t_value) ? true : false
    }
    let value = $state({value:t_value})
    if (typeof t_value === 'boolean' && typeof f_value === 'boolean'){
        return {
            value,
            toggle: () => value.value = !value.value,
            toBoolean: () => value.value
        }
    } else {
        return {
            value,
            toggle: () => value.value = (value.value === t_value) ? f_value : t_value,
            toBoolean: () => truth(value.value) 
        }
    }

    


    
}

function to_frac(n: number): number{
    return n/100
}

// IF PERCENTAGE NAME INCLUDED THE NUMBER IS MEASURED FROM 0 TO 100

const SARGASSUM_POTENTIAL = 37500000 // TOTAL DEL MERCADO DE SARGAZO KG
const ALGINATE_PERCENTAGE_PRODUCTION = 16 //PORCENTAJE DE PRODUCCION DE ALGINATO RELATIVO AL PROCESADO 
const CELULOSE_PERCENTAGE_PRODUCTION = 14//PORCENTAJE DE PRODUCCION DE CELULOSA RELATIVO AL PROCESADO
const SOLID_FOAM_PERCENTAGE_RELATIVE_TO_ALGINATE = 1 // PORCENTAJE DE PRODUCCION DE SOLID FOAM RELATIVO AL ALGINATO
const ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE = 1/to_frac(19)
const ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE = 1/to_frac(19)

let Percentage_Processed = $state([1.35]) // Sargassum Processed by BioPlaster 



let Sargassum_Processed = $derived(to_frac(Percentage_Processed[0])*SARGASSUM_POTENTIAL)

const { value:current_tons, toggle:toggle_tons, toBoolean: current_tons_boolean}= make_toggle('2 ton', '6 ton')


let Product_Basket = $derived({
    Alginato: to_frac(ALGINATE_PERCENTAGE_PRODUCTION)*Sargassum_Processed,
    Celulose: to_frac(CELULOSE_PERCENTAGE_PRODUCTION)*Sargassum_Processed
})

// Revisar el factor 1.1875
let Max_Teorical_Processed = {"2 ton": 2000*0.12*600,"6 ton": 6000*0.12*600}

const Matrix_Cost = $state([
  {
    "product": "GreenShell",
    "capacity": "2 ton",
    "price": 7.36,
    "margin":[30],
    "anualproduction": [0]
  },
  {
    "product": "GreenShell",
    "capacity": "6 ton",
    "price": 7.36,
    "margin":[30],
    "anualproduction": [0]

  },
  {
    "product": "GreenShell Soluble",
    "capacity": "2 ton",
    "price": 5.58,
    "margin":[30],
    "anualproduction": [0]

  },
  {
    "product": "GreenShell Soluble",
    "capacity": "6 ton",
    "price": 4.2,
    "margin":[30],
    "anualproduction": [0]

  },
  {
    "product": "Alginate",
    "capacity": "2 ton",
    "price": 10.13,
    "margin":[30],
    "anualproduction": [0]
  },
  {
    "product": "Alginate",
    "capacity": "6 ton",
    "price": 10.13,
    "margin":[30],
    "anualproduction": [0]
  }
])


$inspect(Product_Basket)




import * as Table from "$lib/components/ui/table";
    import { AlignBaseline } from "svelte-radix";
   
    const invoices = [
      {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card"
      },
      {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal"
      },
      {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer"
      },
      {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card"
      },
      {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal"
      },
      {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer"
      },
      {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card"
      }
    ];



</script>
   
<Button on:click={toggleMode} variant="outline" size="icon">
    <Sun
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
</Button>



<main>
    <div class="">
        <span class=" font-bold">Sargassum Market: {formatNumber(SARGASSUM_POTENTIAL/1000)} Ton</span>
        <Separator/>
        
        <span class=" font-bold">
            Sargassum processed {formatNumber(Math.floor(Sargassum_Processed/1000))} Ton ({Percentage_Processed[0]}% of the market)
        </span>
        <br>
        <span class=" font-bold">
            Capacity Of Production 
        </span>
        <Toggle pressed={current_tons_boolean()} on:click={toggle_tons}>
            2 Ton
        </Toggle>
        <Toggle pressed={!current_tons_boolean()} on:click={toggle_tons}>
            6 Ton
        </Toggle> 
        <Slider bind:value={Percentage_Processed} 
                min={0} 
                max={current_tons_boolean() ?
                 100*Max_Teorical_Processed["2 ton"]/SARGASSUM_POTENTIAL  :  100*Max_Teorical_Processed["6 ton"]/SARGASSUM_POTENTIAL  } 
                step={0.0001}
        />
    </div>

    <div>

    </div>
</main>



   

  <div class="">
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head> Product </Table.Head>
               
                <Table.Head> Production Price </Table.Head>
                <Table.Head> Profit Margin </Table.Head>
                <Table.Head> Public Price </Table.Head>

            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each Matrix_Cost as item, i (i)}
            {$inspect(item.capacity, current_tons)}

            {#if item.capacity == current_tons.value}
                <Table.Row>
                    <Table.Cell>{item.product}</Table.Cell>

                    <Table.Cell>{item.price}</Table.Cell>
                    <Table.Cell>
                        <Slider max={200} bind:value={item.margin}/> {item.margin} %
                    </Table.Cell>
                    <Table.Cell>
                        {Math.floor((1+item.margin[0]/100)*item.price*100)/100}
                    </Table.Cell>
     
                </Table.Row>
            {/if}
            {/each}
        </Table.Body>
      </Table.Root>
  </div>

  <div>
    <span>
        Alginate {Product_Basket.Alginato}
    </span>
    <br>
    <span>
        Celulose {Product_Basket.Celulose}
    </span>
    <span>
         
    </span>
  </div>


  {#if current_tons_boolean()}
  <div>
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head>
                    Product
                </Table.Head>
                <Table.Head>
                    Yearly Production
                </Table.Head>
                <Table.Head>
                    Yearly Revenew
                </Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            <Table.Row>
                <Table.Cell>GreenShell</Table.Cell>
                <Table.Cell>
                    <Slider max={Product_Basket.Alginato*ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE}
                            bind:value={Matrix_Cost[0].anualproduction}
                    />
                    {formatNumber(Matrix_Cost[0].anualproduction[0])} Ton ({Math.ceil(100*(Matrix_Cost[0].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE)/Product_Basket.Alginato) }% of alginate)
                </Table.Cell>
                <Table.Cell>
                    {Matrix_Cost[0].anualproduction[0]*Math.floor((1+Matrix_Cost[0].margin[0]/100)*Matrix_Cost[0].price*100)/100}
       
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>GreenShell Soluble</Table.Cell>
                <Table.Cell>
                    <Slider max={(Product_Basket.Alginato-Matrix_Cost[0].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE)*ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE}
                            bind:value={Matrix_Cost[2].anualproduction}
                    />
                    {Matrix_Cost[2].anualproduction[0]} Ton ({Math.floor(100*(Matrix_Cost[2].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE)/Product_Basket.Alginato) }% of alginate)
                </Table.Cell>
                <Table.Cell>
                    {Matrix_Cost[2].anualproduction[0]*
                    Math.floor(
                        (1+Matrix_Cost[2].margin[0]/100)*
                            Matrix_Cost[2].price*100
                        )/100
                    }
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Alginate</Table.Cell>
                <Table.Cell>
                    {truncate(
                        Product_Basket.Alginato - Matrix_Cost[0].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE- Matrix_Cost[2].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE
                    )
                    }
                </Table.Cell>
                <Table.Cell>
                    {
                    truncate(
                    (Product_Basket.Alginato - Matrix_Cost[0].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE- Matrix_Cost[2].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE)*
                    Math.floor(
                        (1+Matrix_Cost[4].margin[0]/100)*
                            Matrix_Cost[4].price*100
                        )/100
                    )
                    }
                </Table.Cell>
            </Table.Row>
        </Table.Body>
    </Table.Root>
  </div>
    {:else}
    <div>
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>
                        Product
                    </Table.Head>
                    <Table.Head>
                        Yearly Production
                    </Table.Head>
                    <Table.Head>
                        Yearly Revenew
                    </Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>GreenShell</Table.Cell>
                    <Table.Cell>
                        <Slider max={Product_Basket.Alginato*ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE}
                                bind:value={Matrix_Cost[1].anualproduction}
                        />
                        {Matrix_Cost[1].anualproduction[0]} Ton ({Math.ceil(100*(Matrix_Cost[1].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE)/Product_Basket.Alginato) }% of alginate)
                    </Table.Cell>
                    <Table.Cell>
                        {Matrix_Cost[1].anualproduction[0]*Math.floor((1+Matrix_Cost[1].margin[0]/100)*Matrix_Cost[1].price*100)/100}
           
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>GreenShell Soluble</Table.Cell>
                    <Table.Cell>
                        <Slider max={(Product_Basket.Alginato-Matrix_Cost[1].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE)*ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE}
                                bind:value={Matrix_Cost[3].anualproduction}
                        />
                        {Matrix_Cost[3].anualproduction[0]} Ton ({Math.floor(100*(Matrix_Cost[3].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE)/Product_Basket.Alginato) }% of alginate)
                    </Table.Cell>
                    <Table.Cell>
                        {Matrix_Cost[3].anualproduction[0]*
                        Math.floor(
                            (1+Matrix_Cost[3].margin[0]/100)*
                                Matrix_Cost[3].price*100
                            )/100
                        }
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Alginate</Table.Cell>
                    <Table.Cell>
                        {
                            Math.floor( 100*
                            (Product_Basket.Alginato - Matrix_Cost[1].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE- Matrix_Cost[3].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE)
                            )/100
                        }
                    </Table.Cell>
                    <Table.Cell>
                        {
                        Math.floor( 100*
                        (Product_Basket.Alginato - Matrix_Cost[1].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE- Matrix_Cost[3].anualproduction[0]/ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE)*
                        Math.floor(
                            (1+Matrix_Cost[5].margin[0]/100)*
                                Matrix_Cost[5].price*100
                            )/100
                        )/100
                        }
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table.Root>
      </div>
  {/if}


  