import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
    Stack,
    Group,
    Paper,
    Text,
    Title,
    Table,
    Badge,
    Button,
    Card,
    SimpleGrid,
    Box,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import dayjs from "dayjs";

export default function History({ auth, commissions, summary, filters }) {
    const [startDate, setStartDate] = useState(
        filters.start ? new Date(filters.start) : null,
    );
    const [endDate, setEndDate] = useState(
        filters.end ? new Date(filters.end) : null,
    );

    const handleFilter = () => {
        router.get(
            route("mahasiswa.history"),
            {
                // Sesuaikan dengan nama route history-mu
                start_date: startDate
                    ? dayjs(startDate).format("YYYY-MM-DD")
                    : "",
                end_date: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
            },
            { preserveState: true },
        );
    };

    const resetFilter = () => {
        setStartDate(null);
        setEndDate(null);
        router.get(route("mahasiswa.history"));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Riwayat Klaim" />

            <Stack gap="xl">
                <Box>
                    <Title order={2}>Riwayat Klaim & Pendapatan</Title>
                    <Text c="dimmed">
                        Lihat detail pendapatan komisi yang kamu peroleh.
                    </Text>
                </Box>

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                    {/* Input Filter Tanggal */}
                    <Paper withBorder p="md" radius="md">
                        <Text size="sm" fw={700} mb="xs">
                            Cari Berdasarkan Tanggal
                        </Text>
                        <Group align="flex-end" gap="xs">
                            <DateInput
                                label="Dari"
                                placeholder="Pilih tanggal"
                                value={startDate}
                                onChange={setStartDate}
                                size="xs"
                                clearable
                            />
                            <DateInput
                                label="Sampai"
                                placeholder="Pilih tanggal"
                                value={endDate}
                                onChange={setEndDate}
                                size="xs"
                                clearable
                            />
                            <Button size="xs" onClick={handleFilter}>
                                Cari
                            </Button>
                            <Button
                                size="xs"
                                variant="subtle"
                                color="gray"
                                onClick={resetFilter}
                            >
                                Reset
                            </Button>
                        </Group>
                    </Paper>

                    {/* Ringkasan Hasil Filter */}
                    <Card withBorder radius="md" bg="teal.0">
                        <Stack gap={0}>
                            <Text size="xs" c="teal.9" fw={700} tt="uppercase">
                                Total Pendapatan Terfilter
                            </Text>
                            <Title order={2} c="teal.9">
                                Rp{" "}
                                {(summary?.total_income || 0).toLocaleString(
                                    "id-ID",
                                )}
                            </Title>
                            <Text size="xs" c="teal.7">
                                Dari {summary?.total_claims || 0} aktivitas
                                klaim
                            </Text>
                        </Stack>
                    </Card>
                </SimpleGrid>

                {/* Tabel Riwayat */}
                <Paper withBorder radius="md">
                    <Table verticalSpacing="sm" highlightOnHover striped>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Tanggal</Table.Th>
                                <Table.Th>Produk</Table.Th>
                                <Table.Th>ID Pesanan</Table.Th>
                                <Table.Th>Nominal</Table.Th>
                                <Table.Th>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {commissions.length > 0 ? (
                                commissions.map((item) => (
                                    <Table.Tr key={item.id}>
                                        <Table.Td>
                                            {dayjs(item.created_at).format(
                                                "DD MMM YYYY",
                                            )}
                                        </Table.Td>
                                        <Table.Td fw={500}>
                                            {item.product?.name ||
                                                "Produk Dihapus"}
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="xs">
                                                {item.shopee_order_id}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td fw={700}>
                                            Rp{" "}
                                            {item.amount.toLocaleString(
                                                "id-ID",
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge
                                                color={
                                                    item.status === "approved"
                                                        ? "green"
                                                        : item.status ===
                                                            "pending"
                                                          ? "orange"
                                                          : "red"
                                                }
                                                variant="light"
                                            >
                                                {item.status}
                                            </Badge>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={5} ta="center" py="xl">
                                        Tidak ada data klaim untuk periode ini.
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </Paper>
            </Stack>
        </AuthenticatedLayout>
    );
}
