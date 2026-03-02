import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Table,
    Badge,
    Title,
    Stack,
    Paper,
    Text,
    Box,
    Image,
    Group,
    ScrollArea,
} from "@mantine/core";

export default function AdminProductIndex({ auth, products = [] }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Monitoring Produk" />
            <Stack gap="lg">
                <Box>
                    <Title order={2}>Monitoring Katalog Global</Title>
                    <Text c="dimmed">
                        Melihat seluruh produk yang didaftarkan oleh UMKM.
                    </Text>
                </Box>

                <Paper withBorder radius="md">
                    <ScrollArea>
                        <Table verticalSpacing="sm" miw={800}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Produk</Table.Th>
                                    <Table.Th>Pemilik (UMKM)</Table.Th>
                                    <Table.Th>Harga</Table.Th>
                                    <Table.Th>Komisi</Table.Th>
                                    <Table.Th>Stok</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {products.map((p) => (
                                    <Table.Tr key={p.id}>
                                        <Table.Td>
                                            <Group gap="sm">
                                                <Image
                                                    src={p.image_url}
                                                    w={40}
                                                    h={40}
                                                    radius="md"
                                                    fallbackSrc="https://placehold.co/40"
                                                />
                                                <Text size="sm" fw={500}>
                                                    {p.name}
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color="blue" variant="light">
                                                {p.user?.name || "UMKM"}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            Rp {p.price.toLocaleString("id-ID")}
                                        </Table.Td>
                                        <Table.Td c="green.7" fw={600}>
                                            Rp{" "}
                                            {p.commission_amount.toLocaleString(
                                                "id-ID",
                                            )}
                                        </Table.Td>
                                        <Table.Td>{p.stock} pcs</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Paper>
            </Stack>
        </AuthenticatedLayout>
    );
}
