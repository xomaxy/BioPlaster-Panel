<script>
import * as Card from "$lib/components/ui/card";
const {className = ""} = $props()

</script>

<Card.Root class={className}>
            <Card.Header>
                <Card.Title class="text-xl font-bold">
                    <slot name="Title"/>
                </Card.Title>
                <Card.Description>
                    <slot name="Description"/>
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <slot name="Content"/>
            </Card.Content>
            <Card.Footer>
                <slot name="Footer"/>
            </Card.Footer>
</Card.Root>
