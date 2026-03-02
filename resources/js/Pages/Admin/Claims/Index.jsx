import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Table, Badge, Title, Stack, Paper, Text, Box } from "@mantine/core";

export default function AdminClaimIndex({ auth, commissions = [] }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Monitoring Klaim" />
            <Stack gap="lg">
                <Box>
                    <Title order={2}>Log Aktivitas Klaim</Title>
                    <Text c="dimmed">Memantau seluruh transaksi komisi antara Mahasiswa dan UMKM.</Text>
                </Box>

                <Paper withBorder radius="md">
                    <Table verticalSpacing="sm" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Mahasiswa</Table.Th>
                                <Table.Th>Produk</Table.Th>
                                <Table.Th>Order ID Shopee</Table.Th>
                                <Table.Th>Nominal</Table.Th>
                                <Table.Th>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {commissions.map((c) => (
                                <Table.Tr key={c.id}>
                                    <Table.Td>
                                        <Text size="sm" fw={500}>{c.user?.name}</Text>
                                        <Text size="xs" c="dimmed">{c.user?.email}</Text>
                                    </Table.Td>
                                    <Table.Td>{c.product?.name}</Table.Td>
                                    <Table.Td><Text family="monospace" fw={700}>{c.shopee_order_id}</Text></Table.Td>
                                    <Table.Td fw={600}>Rp {Number(c.amount).toLocaleString('id-ID')}</Table.Td>
                                    <Table.Td>
                                        <Badge color={c.status === 'approved' ? 'green' : (c.status === 'pending' ? 'yellow' : 'red')}>
                                            {c.status}
                                        </Badge>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Paper>
            </Stack>
        </AuthenticatedLayout>
    );
}