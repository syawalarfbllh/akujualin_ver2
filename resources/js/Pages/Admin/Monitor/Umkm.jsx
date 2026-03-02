import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Table,
    Avatar,
    Text,
    Group,
    Badge,
    Paper,
    Title,
    ActionIcon,
    Pagination,
    Stack,
    ScrollArea,
} from "@mantine/core";
import { IconBuildingStore, IconEye } from "@tabler/icons-react";

export default function MonitorUmkm({ auth, sellers }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number || 0);
    };

    const rows = sellers.data.map((item) => (
        <Table.Tr key={item.id}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar src={item.avatar} radius="xl" color="blue">
                        {item.name.charAt(0)}
                    </Avatar>
                    <div>
                        <Text fz="sm" fw={500}>
                            {item.name}
                        </Text>
                        <Text fz="xs" c="dimmed">
                            {item.email}
                        </Text>
                    </div>
                </Group>
            </Table.Td>
            <Table.Td>
                <Badge variant="light" color="gray">
                    {item.products_count} Produk
                </Badge>
            </Table.Td>
            <Table.Td align="right">
                <Text fw={700} c="blue">
                    {formatRupiah(item.total_omzet)}
                </Text>
                <Text fz="xs" c="dimmed">
                    Total Omzet Kotor
                </Text>
            </Table.Td>
            <Table.Td align="right">
                <Text fw={700} c="red">
                    - {formatRupiah(item.total_payout)}
                </Text>
                <Text fz="xs" c="dimmed">
                    Beban Komisi
                </Text>
            </Table.Td>
            <Table.Td align="right">
                {/* Pendapatan Bersih (Omzet - Komisi) */}
                <Text fw={700} c="teal">
                    {formatRupiah(
                        (item.total_omzet || 0) - (item.total_payout || 0),
                    )}
                </Text>
                <Text fz="xs" c="dimmed">
                    Net Profit
                </Text>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Monitoring UMKM" />
            <Stack>
                <Group justify="space-between">
                    <Title order={3}>Monitoring Staff UMKM</Title>
                    <Link href={route("dashboard")}>
                        <Badge color="gray">Kembali ke Dashboard</Badge>
                    </Link>
                </Group>

                <Paper withBorder p="md" radius="md">
                    <ScrollArea>
                        <Table highlightOnHover verticalSpacing="sm" miw={900}>
                            <Table.Thead bg="gray.0">
                                <Table.Tr>
                                    <Table.Th>Nama UMKM / Seller</Table.Th>
                                    <Table.Th>Aset Produk</Table.Th>
                                    <Table.Th style={{ textAlign: "right" }}>
                                        Total Omzet
                                    </Table.Th>
                                    <Table.Th style={{ textAlign: "right" }}>
                                        Komisi Dibayar
                                    </Table.Th>
                                    <Table.Th style={{ textAlign: "right" }}>
                                        Pendapatan Bersih
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {rows.length > 0 ? (
                                    rows
                                ) : (
                                    <Table.Tr>
                                        <Table.Td colSpan={5} align="center">
                                            Belum ada data UMKM
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>

                        {/* Pagination Sederhana */}
                        <Group justify="center" mt="md">
                            <Pagination
                                total={sellers.last_page}
                                value={sellers.current_page}
                                onChange={() => {}}
                            />
                        </Group>
                    </ScrollArea>
                </Paper>
            </Stack>
        </AuthenticatedLayout>
    );
}
