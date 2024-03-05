<script lang="ts">
    
    import * as Table from "$lib/components/ui/table";
    import { Slider } from "$lib/components/ui/slider"
    import {Toggle} from "$lib/components/ui/toggle";

    import {make_toggle} from "$lib/utils.svelte";
    import {constants} from "$lib/panel.svelte"
    import Test from "./Test.svelte"

    import numbro from "numbro";

    import MyCard from "$lib/tiles/MyCard.svelte"
    import MyTable from "$lib/tiles/MyTable.svelte";


function to_frac(n: number): number{
    return n/100
}


let Slider_Percentage_Processed = $state([1.35]) // Sargassum Processed by BioPlaster
let Percentage_Processed = $derived(Slider_Percentage_Processed[0]) // Sargassum Processed by BioPlaster 
let Sargassum_Processed = $derived(to_frac(Percentage_Processed)*constants.SARGASSUM_POTENTIAL)
const tons = make_toggle('2 ton', '6 ton')
let Product_Basket = $derived({
    Alginato: to_frac(constants.ALGINATE_PERCENTAGE_PRODUCTION)*Sargassum_Processed,
    Celulose: to_frac(constants.CELULOSE_PERCENTAGE_PRODUCTION)*Sargassum_Processed
})

const Product_State = $state({
    alginate: {
        production_cost: {
            "2 ton": 10.13,
            "6 ton": 10.13
        },
        profit_slider: {
            max: 2,
            value: [.3],
            step: 0.001
        },
        pretty_name: "Alginate",
        max_production:()=>Product_Basket.Alginato,
        current_production:()=>{
            return Product_Basket.Alginato
            - Product_State.greenshell.production_slider.value[0]
            - Product_State.greenshellsoluble.production_slider.value[0]
        }
        
    },
    celulose: {
        production_cost: {
            "2 ton": 17.83,
            "6 ton": 17.83
        },
        profit_slider: {
            max: 2,
            value: [.3],
            step: 0.001
        },
        pretty_name: "Celulose",
        max_production:()=>Product_Basket.Celulose,
        current_production:()=>{
            return Product_Basket.Celulose
            - Product_State.greenshell.production_slider.value[0]/
                constants.CELULOSE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE
                
            - Product_State.greenshellsoluble.production_slider.value[0]/
                constants.CELULOSE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE
        }
    },
    greenshell: {
        production_cost: {
            "2 ton": 7.36,
            "6 ton": 7.36
        },
        profit_slider: {
            max: 2,
            value: [.3],
            step: 0.001
        },
        production_slider:{
            max: ()=>Product_Basket.Alginato*47/100,
            value: [0],
            step: 0.001
        },
        pretty_name: "GreenShell",
        max_production:()=>Product_Basket.Alginato*constants.ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE
    },
    greenshellsoluble: {
        production_cost: { 
            "2 ton": 5.58,
            "6 ton": 4.2
        },
        profit_slider: {
            max: 2,
            value: [.3],
            step: 0.001
        },
        production_slider:{
            max: () => {return Product_Basket.Alginato*47/100 - Product_State.greenshell.production_slider.value[0]},
            value: [0],
            step: 0.001
        },
        pretty_name: "GreenShell Soluble",
        max_production:()=>Product_Basket.Alginato*constants.ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE
    },
})

function getincome(){

    // Production*(margin)*price

    return Product_State.alginate.current_production()*
                            (Product_State.alginate.profit_slider.value[0]+1)*
                            Product_State.alginate.production_cost[tons.value]+

                            Product_State.greenshell.production_cost[tons.value]*
                            (Product_State.greenshell.profit_slider.value[0]+1)*
                            Product_State.greenshell.production_slider.value[0]*
                            constants.ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE+

                            Product_State.greenshellsoluble.production_cost[tons.value]*
                            (Product_State.greenshellsoluble.profit_slider.value[0]+1)*
                            Product_State.greenshellsoluble.production_slider.value[0]*
                            constants.ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE

}

function getdirectcost(){
    //CurrentCost*ProductionFoam
    return Product_State.greenshell.production_cost[tons.value]*
                        Product_State.greenshell.production_slider.value[0]*
                        constants.ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE+

                        Product_State.greenshellsoluble.production_cost[tons.value]*
                        Product_State.greenshellsoluble.production_slider.value[0]*
                        constants.ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE
}

function getproduction(){
    //ProductionSolidFoamNOSol + SOl
    return Product_State.greenshell.production_slider.value[0]*
                        constants.ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE+
                        Product_State.greenshellsoluble.production_slider.value[0]*
                        constants.ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE
}

let income = $state(getincome())
let direct_cost = $state(getdirectcost())
let production = $state(getproduction())

$effect(()=>{
    income = getincome()
    direct_cost = getdirectcost()
    production = getproduction()

})

</script>


{#snippet specialTable(Products)}
    <MyTable>
        <svelte:fragment slot="Header">
                <Table.Head> Product </Table.Head>
                <Table.Head> Yearly Production </Table.Head>
                <Table.Head> Yearly Revenue </Table.Head>
        </svelte:fragment>
        <svelte:fragment slot="Body">


            <!-- Alginate -->
                <Table.Row>
                    <Table.Cell>
                        {Products.alginate.pretty_name}
                    </Table.Cell>
                    <Table.Cell>
                        {
                            numbro(
                                (
                                    Products.alginate.current_production()
                                
                                )/1000
                            ).format({thousandSeparated: true,
                                    mantissa: 2})
                        } Ton
                    </Table.Cell>
                    <Table.Cell>
                        {
                            numbro(
                                Products.alginate.current_production()*
                                (Products.alginate.profit_slider.value[0]+1)*
                                Products.alginate.production_cost[tons.value]
                            ).format({
                                output: "currency",
                                thousandSeparated: true,
                                mantissa: 2
                            })
                        }
                    </Table.Cell>
                </Table.Row>
            
            <!-- Celulose -->
            <Table.Row>
                <Table.Cell>
                    {Products.celulose.pretty_name}
                </Table.Cell>
                <Table.Cell>
                    {
                        numbro(
                            Products.celulose.current_production()/1000
                        )
                        .format({thousandSeparated: true,
                                mantissa: 2})
                    } Ton
                </Table.Cell>
                <Table.Cell>
                    {
                        numbro(
                        Products.celulose.current_production()*
                        Products.celulose.profit_slider.value[0]
                        ).format({
                            output: "currency",
                            thousandSeparated: true,
                            mantissa: 2
                        })
                    }
                </Table.Cell>
            </Table.Row>

            <!-- Greenshell -->
            <Table.Row>
                <Table.Cell>
                    {Products.greenshell.pretty_name}
                </Table.Cell>
                <Table.Cell>
                    <Slider
                        max={Products.greenshell.production_slider.max()}
                        step={Products.greenshell.production_slider.step}
                        bind:value={Products.greenshell.production_slider.value}
                    />
                    {
                        numbro(
                        Products.greenshell.production_slider.value*
                        constants.ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE/1000
                        ).format({
                            thousandSeparated: true,
                            mantissa: 2
                        })
                    } Ton of GreenShell <br/>
                    ({numbro(
                        (Products.greenshell.production_slider.value)
                        /Product_Basket.Alginato 
                        ).format({
                            output: "percent",
                            mantissa: 1
                        })
                    } of alginate used)
                </Table.Cell>
                <Table.Cell>
                    {
                        numbro(
                            Products.greenshell.production_cost[tons.value]*
                            (Products.greenshell.profit_slider.value[0]+1)*
                            Products.greenshell.production_slider.value[0]*
                            constants.ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE
                        ).format({
                            output: "currency",
                            thousandSeparated: true,
                            mantissa: 2
                        })
                    }
                </Table.Cell>
            </Table.Row>

            <!-- Greenshell Soluble -->
            <Table.Row>
                <Table.Cell>
                    {Products.greenshellsoluble.pretty_name}
                </Table.Cell>
                <Table.Cell>
                    <Slider
                        max={Products.greenshellsoluble.production_slider.max()}
                        step={Products.greenshellsoluble.production_slider.step}
                        bind:value={Products.greenshellsoluble.production_slider.value}
                    />
                    {
                        numbro(
                        Products.greenshellsoluble.production_slider.value*
                        constants.ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE/1000
                        ).format({
                            thousandSeparated: true,
                            mantissa: 2
                        })
                    } Ton of GreenShell <br/>
                    ({numbro(
                        (Products.greenshellsoluble.production_slider.value)/Product_Basket.Alginato 
                        ).format({
                            output: "percent",
                            mantissa: 1
                        })
                    } of alginate used)
                </Table.Cell>
                <Table.Cell>
                    {
                        numbro(
                            Products.greenshellsoluble.production_cost[tons.value]*
                            (Products.greenshellsoluble.profit_slider.value[0]+1)*
                            Products.greenshellsoluble.production_slider.value[0]*
                            constants.ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE
                        ).format({
                            output: "currency",
                            thousandSeparated: true,
                            mantissa: 2
                        })
                    }
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>

                </Table.Cell>
                <Table.Head>
                    Total
                </Table.Head>
                <Table.Cell>
                    {
                        numbro(
                            
                            Products.alginate.current_production()*
                            (Products.alginate.profit_slider.value[0]+1)*
                            Products.alginate.production_cost[tons.value]+

                            Products.greenshell.production_cost[tons.value]*
                            (Products.greenshell.profit_slider.value[0]+1)*
                            Products.greenshell.production_slider.value[0]*
                            constants.ALGINATE_TO_SOLIDFOAM_RATIO_NO_SOLUBLE+

                            Products.greenshellsoluble.production_cost[tons.value]*
                            (Products.greenshellsoluble.profit_slider.value[0]+1)*
                            Products.greenshellsoluble.production_slider.value[0]*
                            constants.ALGINATE_TO_SOLIDFOAM_RATIO_SOLUBLE
                        ).format({
                            output: "currency",
                            thousandSeparated: true,
                            mantissa: 2
                        })
                    }
                </Table.Cell>
            </Table.Row>
        </svelte:fragment>
    </MyTable>
{/snippet}


<div class="xl:grid xl:grid-cols-4 gap-5 m-4
            lg:grid lg:grid-cols-4
            sm:flex sm:flex-col ">
    <MyCard className="row-span-3">
        <svelte:fragment slot="Title">
            Market Status
        </svelte:fragment>
        <svelte:fragment slot="Description">
            Adjust the production estimate here by considering production capacity and the amount of sargassum processed.
        </svelte:fragment>
        <svelte:fragment slot="Content">
            <h3 class="text-lg font-semibold">
                Sargassum Market
            </h3>
            <p class="mb-3">
                {numbro(constants.SARGASSUM_POTENTIAL/1000)
                    .format({thousandSeparated: true,
                             mantissa: 0})} Ton
            </p>
                    
            <h3 class="text-lg font-semibold">
                Capacity of Production
            </h3>        
            <Toggle pressed={tons.val_to_boolean} onclick={tons.toggle}>
                1 M
            </Toggle>
            <Toggle pressed={!tons.val_to_boolean} onclick={tons.toggle}>
                2.5 M
            </Toggle> 
            <div class="mb-3"></div>
            <h3 class="text-lg font-semibold">
                Sargassum Processed
            </h3>
            
            {numbro(Sargassum_Processed/1000)
            .format({thousandSeparated: true,
                    mantissa: 2})
            } Ton <br/> ({numbro(Percentage_Processed/100).format({output: "percent", mantissa: 2})} of the market)
            <div class="mb-3"></div>
            <Slider class="p-10"
                    bind:value={Slider_Percentage_Processed} 
                    max={tons.val_to_boolean ?
                    100*constants.MAX_TEORICAL_PROCESSED["2 ton"]/constants.SARGASSUM_POTENTIAL  :
                    100*constants.MAX_TEORICAL_PROCESSED["6 ton"]/constants.SARGASSUM_POTENTIAL  } 
                    step={0.0001}
            />

            {numbro(
                Percentage_Processed/
                (tons.val_to_boolean ?
                100*constants.MAX_TEORICAL_PROCESSED["2 ton"]/constants.SARGASSUM_POTENTIAL  :
                100*constants.MAX_TEORICAL_PROCESSED["6 ton"]/constants.SARGASSUM_POTENTIAL))
                .format({output: "percent", mantissa: 2})}
    
            <h3 class="text-lg font-semibold">
                Alginate Production
            </h3>
             {numbro(Product_Basket.Alginato/1000).format({thousandSeparated: true, mantissa: 2})} Ton
             <div class="mb-3"></div>
            <h3 class="text-lg font-semibold">
                Celulose Production
            </h3>
             {numbro(Product_Basket.Celulose/1000).format({thousandSeparated: true, mantissa: 2})} Ton
            <br/>
            <div class="mb-3"></div>

                <Test
                    bind:INCOME={
                        income
                    }
                    bind:PRODUCTION_SOLID_FOAM={
                        production
                    }
                    bind:DIRECT_COST={
                        direct_cost

                    }
                />

        </svelte:fragment>
    </MyCard>
    
    <MyCard className="col-span-3">
        <svelte:fragment slot="Title">
            Production Costs
        </svelte:fragment>
        <svelte:fragment slot="Description">
            Adjust the estimated production here based on production capacity and processed sargassum
        </svelte:fragment>
        <svelte:fragment slot="Content">
            <MyTable>
                <svelte:fragment slot="Header">
                    <Table.Head> Product </Table.Head>
                    <Table.Head> Production Costs </Table.Head>
                    <Table.Head> Profit Margin </Table.Head>
                    <Table.Head> Public Price </Table.Head>
                </svelte:fragment>
                <svelte:fragment slot="Body">
                    {#each Object.values(Product_State) as item}
                        <Table.Row>
                            <Table.Cell>
                                {item.pretty_name}
                            </Table.Cell>
                            <Table.Cell>
                            {#if typeof tons.value === "string"}
                                {
                                    numbro(
                                    (item.production_cost as any)[tons.value]
                                    ).format(
                                        {
                                            output: "currency",
                                            mantissa: 2
                                        }
                                    )
                                }
                            {/if}
                                
                            </Table.Cell>
                            <Table.Cell>
                                <Slider 
                                    max={item.profit_slider.max}
                                    step={item.profit_slider.step}
                                    bind:value={item.profit_slider.value}
                                />
                                {
                                    numbro(item.profit_slider.value[0]).format(
                                        {
                                            output: "percent",
                                            mantissa: 1
                                        }
                                    )
                                }
                            </Table.Cell>
                            <Table.Cell>
                                {#if typeof tons.value === "string"}
                                {
                                    numbro(
                                        (1+item.profit_slider.value[0])*(item.production_cost as any)[tons.value]
                                    ).format(
                                        {
                                            output: "currency",
                                            mantissa: 2
                                        }
                                    )
                                }
                                {/if}
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </svelte:fragment>
            </MyTable>
            
        </svelte:fragment>
    </MyCard>

    <MyCard className="col-span-3">
        <svelte:fragment slot="Title">
            Yearly Production
        </svelte:fragment>
        <svelte:fragment slot="Content">       
            {@render specialTable(Product_State)}
        </svelte:fragment>
    </MyCard>

</div>





  