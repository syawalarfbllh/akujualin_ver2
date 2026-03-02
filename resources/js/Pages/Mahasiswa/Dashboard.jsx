import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage, Link } from "@inertiajs/react";
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
    Button,
    Container,
    ThemeIcon,
    ActionIcon,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
    IconCurrencyDollar,
    IconShoppingCart,
    IconClock,
    IconCalendar,
    IconFilter,
    IconRocket,
    IconHistory,
    IconLayoutDashboard,
    IconVideo,
    IconSearch,
} from "@tabler/icons-react";
import DashboardChart from "@/Components/DashboardChart";
import { useState } from "react";
import dayjs from "dayjs";

export default function Dashboard({
    auth,
    stats,
    chartData,
    filters,
    recentClaims = [],
}) {
    const [dateRange, setDateRange] = useState([
        filters.start ? new Date(filters.start) : null,
        filters.end ? new Date(filters.end) : null,
    ]);

    const { processing } = usePage();

    const handleFilter = () => {
        if (dateRange[0] && dateRange[1]) {
            router.get(
                route("mahasiswa.dashboard"),
                {
                    start_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
                    end_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ["stats", "chartData", "filters"],
                },
            );
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Mahasiswa" />

            <Container size="xl" px={{ base: 0, sm: "md" }} pb={80}>
                <Stack gap="xl">
                    {/* SECTION 1: WELCOME & FILTER */}
                    <Paper p="md" radius="md" withBorder shadow="xs">
                        <Grid align="flex-end">
                            <Grid.Col span={{ base: 12, md: 7 }}>
                                <Stack gap={4}>
                                    <Title
                                        order={2}
                                        size={{ base: "h3", sm: "h2" }}
                                    >
                                        Halo, {auth.user.name.split(" ")[0]}! 👋
                                    </Title>
                                    <Text c="dimmed" size="sm">
                                        Pantau performa afiliasi dan klaim
                                        komisimu di sini.
                                    </Text>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 5 }}>
                                <Group gap="xs" wrap="nowrap" align="flex-end">
                                    <DatePickerInput
                                        type="range"
                                        placeholder="Pilih periode"
                                        value={dateRange}
                                        onChange={setDateRange}
                                        leftSection={<IconCalendar size={16} />}
                                        size="sm"
                                        style={{ flex: 1 }}
                                    />
                                    <Button
                                        onClick={handleFilter}
                                        loading={processing}
                                        color="indigo"
                                    >
                                        <IconFilter size={18} />
                                    </Button>
                                </Group>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* SECTION 2: QUICK ACTIONS (DISESUAIKAN DENGAN ROUTE KAMU) */}
                    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                        <Button
                            component={Link}
                            href={route("mahasiswa.katalog")}
                            variant="light"
                            color="blue"
                            h={80}
                            radius="md"
                        >
                            <Stack align="center" gap={4}>
                                <IconSearch size={24} />
                                <Text size="xs">Katalog</Text>
                            </Stack>
                        </Button>
                        <Button
                            component={Link}
                            href={route("mahasiswa.content.library")}
                            variant="light"
                            color="teal"
                            h={80}
                            radius="md"
                        >
                            <Stack align="center" gap={4}>
                                <IconVideo size={24} />
                                <Text size="xs">Konten Video</Text>
                            </Stack>
                        </Button>
                        <Button
                            component={Link}
                            href={route("mahasiswa.claim.history")}
                            variant="light"
                            color="orange"
                            h={80}
                            radius="md"
                        >
                            <Stack align="center" gap={4}>
                                <IconHistory size={24} />
                                <Text size="xs">Riwayat Klaim</Text>
                            </Stack>
                        </Button>
                        <Button
                            component={Link}
                            href={route("mahasiswa.katalog")} // Mengarahkan ke katalog untuk pilih produk yang mau diklaim
                            variant="light"
                            color="grape"
                            h={80}
                            radius="md"
                        >
                            <Stack align="center" gap={4}>
                                <IconRocket size={24} />
                                <Text size="xs">Klaim Baru</Text>
                            </Stack>
                        </Button>
                    </SimpleGrid>

                    {/* SECTION 3: STATS CARDS */}
                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                        <Paper
                            withBorder
                            p="lg"
                            radius="md"
                            shadow="sm"
                            bg="teal.0"
                        >
                            <Group justify="space-between">
                                <Stack gap={0}>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        fw={700}
                                        tt="uppercase"
                                    >
                                        Komisi Saya
                                    </Text>
                                    <Text size="xl" fw={800} c="teal.9">
                                        {/* Menggunakan pendapatan yang sudah divalidasi/approved */}
                                        Rp{" "}
                                        {(
                                            stats?.totalEarnings || 0
                                        ).toLocaleString("id-ID")}
                                    </Text>
                                </Stack>
                                <ThemeIcon
                                    size={40}
                                    radius="md"
                                    color="teal"
                                    variant="light"
                                >
                                    <IconCurrencyDollar size={24} />
                                </ThemeIcon>
                            </Group>
                        </Paper>

                        <Paper withBorder p="lg" radius="md" shadow="sm">
                            <Group justify="space-between">
                                <Stack gap={0}>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        fw={700}
                                        tt="uppercase"
                                    >
                                        Klaim Diproses
                                    </Text>
                                    <Text size="xl" fw={800}>
                                        {stats?.pendingClaims || 0} Klaim
                                    </Text>
                                </Stack>
                                <ThemeIcon
                                    size={40}
                                    radius="md"
                                    color="orange"
                                    variant="light"
                                >
                                    <IconClock size={24} />
                                </ThemeIcon>
                            </Group>
                        </Paper>

                        <Paper withBorder p="lg" radius="md" shadow="sm">
                            <Group justify="space-between">
                                <Stack gap={0}>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        fw={700}
                                        tt="uppercase"
                                    >
                                        Total Produk Terjual
                                    </Text>
                                    <Text size="xl" fw={800}>
                                        {stats?.successSales || 0} Unit
                                    </Text>
                                </Stack>
                                <ThemeIcon
                                    size={40}
                                    radius="md"
                                    color="blue"
                                    variant="light"
                                >
                                    <IconShoppingCart size={24} />
                                </ThemeIcon>
                            </Group>
                        </Paper>
                    </SimpleGrid>

                    {/* SECTION 4: CHART */}
                    <Paper withBorder p="md" radius="md" shadow="sm">
                        <Title order={4} mb="lg">
                            Grafik Komisi Mingguan
                        </Title>
                        <Box
                            style={{
                                width: "100%",
                                height: 350,
                                minHeight: 300,
                            }}
                        >
                            <DashboardChart data={chartData} color="teal" />
                        </Box>
                    </Paper>

                    {/* SECTION 5: TABLES */}
                    <Paper withBorder radius="md" shadow="sm">
                        <Group justify="space-between" p="md">
                            <Title order={4}>Riwayat Klaim Terakhir</Title>
                            <Button
                                variant="subtle"
                                size="xs"
                                component={Link}
                                href={route("mahasiswa.claim.history")}
                            >
                                Lihat Semua
                            </Button>
                        </Group>
                        <Table.ScrollContainer minWidth={500}>
                            <Table verticalSpacing="sm">
                                <Table.Thead bg="gray.0">
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
                                                    <Text size="sm" fw={500}>
                                                        {claim.product?.name ||
                                                            "Produk Dihapus"}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        variant="dot"
                                                        color="gray"
                                                    >
                                                        {claim.shopee_order_id}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        color={
                                                            claim.status ===
                                                            "approved"
                                                                ? "green"
                                                                : claim.status ===
                                                                    "pending"
                                                                  ? "orange"
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
                                                py="xl"
                                                c="dimmed"
                                            >
                                                Belum ada aktivitas.
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    </Paper>
                </Stack>
            </Container>

            {/* FLOATING MOBILE NAVIGATION */}
            <Paper
                hiddenFrom="sm"
                p="xs"
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    borderTop: "1px solid #eee",
                }}
            >
                <Group justify="space-around">
                    <ActionIcon
                        component={Link}
                        href={route("mahasiswa.dashboard")}
                        variant="transparent"
                        color="indigo"
                        size="xl"
                    >
                        <Stack gap={2} align="center">
                            <IconLayoutDashboard size={20} />
                            <Text size="10px">Home</Text>
                        </Stack>
                    </ActionIcon>
                    <ActionIcon
                        component={Link}
                        href={route("mahasiswa.katalog")}
                        variant="transparent"
                        color="gray"
                        size="xl"
                    >
                        <Stack gap={2} align="center">
                            <IconSearch size={20} />
                            <Text size="10px">Katalog</Text>
                        </Stack>
                    </ActionIcon>
                    <ActionIcon
                        component={Link}
                        href={route("mahasiswa.claim.history")}
                        variant="transparent"
                        color="gray"
                        size="xl"
                    >
                        <Stack gap={2} align="center">
                            <IconHistory size={20} />
                            <Text size="10px">Riwayat</Text>
                        </Stack>
                    </ActionIcon>
                </Group>
            </Paper>
        </AuthenticatedLayout>
    );
}
