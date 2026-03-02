import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Grid,
    Paper,
    Text,
    Group,
    Stack,
    RingProgress,
    Table,
    Badge,
    Card,
    SimpleGrid,
    Box,
    Title,
} from "@mantine/core";
import {
    IconCurrencyDollar,
    IconShoppingCart,
    IconClock,
} from "@tabler/icons-react";
import DashboardChart from "@/Components/DashboardChart";

export default function Dashboard({
    auth,
    stats,
    chart_data,
    filters,
    recentClaims = [],
}) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Mahasiswa" />

            <Stack gap="xl">
                <Box>
                    <Title order={2}>Halo, {auth.user.name}! 👋</Title>
                    <Text c="dimmed">Pantau hasil jerih payahmu di sini.</Text>
                </Box>

                {/* Ringkasan Statistik */}
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                    <Card withBorder padding="lg" radius="md">
                        <Group justify="space-between">
                            <Stack gap={0}>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    fw={700}
                                    tt="uppercase"
                                >
                                    Total Pendapatan
                                </Text>
                                <Text size="xl" fw={700}>
                                    Rp{" "}
                                    {(stats?.totalEarnings || 0).toLocaleString(
                                        "id-ID",
                                    )}
                                </Text>
                            </Stack>
                            <IconCurrencyDollar size={32} color="green" />
                        </Group>
                    </Card>

                    <Card withBorder padding="lg" radius="md">
                        <Group justify="space-between">
                            <Stack gap={0}>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    fw={700}
                                    tt="uppercase"
                                >
                                    Menunggu Validasi
                                </Text>
                                <Text size="xl" fw={700}>
                                    {stats?.pendingClaims || 0} Klaim
                                </Text>
                            </Stack>
                            <IconClock size={32} color="orange" />
                        </Group>
                    </Card>

                    <Card withBorder padding="lg" radius="md">
                        <Group justify="space-between">
                            <Stack gap={0}>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    fw={700}
                                    tt="uppercase"
                                >
                                    Produk Terjual
                                </Text>
                                <Text size="xl" fw={700}>
                                    {stats?.totalSales || 0} Unit
                                </Text>
                            </Stack>
                            <IconShoppingCart size={32} color="blue" />
                        </Group>
                    </Card>
                </SimpleGrid>

                {/* Chart Section - Menampilkan Tren Pendapatan Mahasiswa */}
                <DashboardChart
                    title="Grafik Pendapatan Saya"
                    data={chart_data}
                    filters={filters}
                    color="teal"
                />

                <Grid gutter="lg">
                    {/* Riwayat Klaim Terakhir */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Paper withBorder radius="md" p="md">
                            <Title order={4} mb="md">
                                Aktivitas Klaim Terakhir
                            </Title>
                            <Table.ScrollContainer minWidth={500}>
                                <Table verticalSpacing="sm" highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Produk</Table.Th>
                                            <Table.Th>ID Pesanan</Table.Th>
                                            <Table.Th>Status</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {recentClaims.length > 0 ? (
                                            recentClaims.map((claim) => (
                                                <Table.Tr key={claim.id}>
                                                    <Table.Td>
                                                        {claim.product.name}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text
                                                            size="sm"
                                                            fw={600}
                                                        >
                                                            {
                                                                claim.shopee_order_id
                                                            }
                                                        </Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Badge
                                                            color={
                                                                claim.status ===
                                                                "approved"
                                                                    ? "green"
                                                                    : claim.status ===
                                                                        "pending"
                                                                      ? "yellow"
                                                                      : "red"
                                                            }
                                                            variant="light"
                                                        >
                                                            {claim.status}
                                                        </Badge>
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))
                                        ) : (
                                            <Table.Tr>
                                                <Table.Td
                                                    colSpan={3}
                                                    ta="center"
                                                    c="dimmed"
                                                    py="xl"
                                                >
                                                    Belum ada aktivitas.
                                                </Table.Td>
                                            </Table.Tr>
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </Table.ScrollContainer>
                        </Paper>
                    </Grid.Col>

                    {/* Progres Target */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Paper withBorder radius="md" p="md" ta="center">
                            <Title order={4} mb="md">
                                Target Mingguan
                            </Title>
                            <Group justify="center">
                                <RingProgress
                                    size={180}
                                    thickness={16}
                                    roundCaps
                                    sections={[{ value: 40, color: "teal" }]}
                                    label={
                                        <Text ta="center" fw={700} size="xl">
                                            40%
                                        </Text>
                                    }
                                />
                            </Group>
                            <Text size="sm" mt="md" c="dimmed">
                                Tingkatkan lagi share link-mu untuk mencapai
                                target pendapatan bulan ini!
                            </Text>
                        </Paper>
                    </Grid.Col>
                </Grid>
            </Stack>
        </AuthenticatedLayout>
    );
}
