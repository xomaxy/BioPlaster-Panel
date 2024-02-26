<script>
import * as Table from "$lib/components/ui/table";
</script>

<Table.Root>
    <Table.Header>
        <Table.Row>
        <slot name="Header"/>
        </Table.Row>
    </Table.Header>
    <Table.Body>
        <slot name="Body"/>
    </Table.Body>
</Table.Root>

