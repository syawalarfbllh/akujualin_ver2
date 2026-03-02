import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Grid,
    Paper,
    Text,
    Group,
    Stack,
    Button,
    SimpleGrid,
    Title,
    Box,
    ThemeIcon,
    Container,
    Badge,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
    IconBox,
    IconAlertCircle,
    IconChartBar,
    IconCoin, // Icon untuk Komisi/Uang Keluar
    IconArrowRight,
    IconCalendar,
    IconFilter,
} from "@tabler/icons-react";
import DashboardChart from "@/Components/DashboardChart";
import { useState } from "react";
import dayjs from "dayjs";

// Perhatikan props baru: chart_omzet dan chart_commission
export default function Dashboard({
    auth,
    stats,
    chart_omzet,
    chart_commission,
    filters,
}) {
    const [dateRange, setDateRange] = useState([
        filters.start ? new Date(filters.start) : null,
        filters.end ? new Date(filters.end) : null,
    ]);

    const handleFilter = () => {
        if (dateRange[0] && dateRange[1]) {
            router.get(
                route("staff.dashboard"),
                {
                    start_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
                    end_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
                },
                { preserveState: true, preserveScroll: true },
            );
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard UMKM" />

            <Container size="xl" px={{ base: 0, sm: "md" }}>
                <Stack gap="xl">
                    {/* SECTION 1: HEADER & FILTER */}
                    <Paper p="md" radius="md" withBorder shadow="xs">
                        <Grid align="flex-end" gutter="md">
                            <Grid.Col span={{ base: 12, md: 7 }}>
                                <Stack gap={5}>
                                    <Group gap="xs">
                                        <Title
                                            order={2}
                                            size={{ base: "h3", sm: "h2" }}
                                        >
                                            Halo, {auth.user.name.split(" ")[0]}
                                            ! 👋
                                        </Title>
                                        <Badge
                                            variant="light"
                                            color="blue"
                                            visibleFrom="sm"
                                        >
                                            Staff UMKM
                                        </Badge>
                                    </Group>
                                    <Text c="dimmed" size="sm">
                                        Ringkasan performa penjualan dan
                                        pengeluaran komisi Anda.
                                    </Text>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 5 }}>
                                <Group gap="xs" align="flex-end" wrap="nowrap">
                                    <DatePickerInput
                                        type="range"
                                        label="Filter Periode"
                                        placeholder="Pilih rentang tanggal"
                                        value={dateRange}
                                        onChange={setDateRange}
                                        leftSection={<IconCalendar size={16} />}
                                        size="sm"
                                        style={{ flex: 1 }}
                                    />
                                    <Button
                                        onClick={handleFilter}
                                        color="indigo"
                                        variant="filled"
                                        px="sm"
                                    >
                                        <IconFilter size={18} />
                                    </Button>
                                </Group>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* SECTION 2: STATS CARDS (4 KOLOM) */}
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                        {/* 1. Total Produk */}
                        <Paper withBorder p="md" radius="md" shadow="sm">
                            <Group justify="space-between">
                                <Stack gap={0}>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        fw={700}
                                        tt="uppercase"
                                    >
                                        Produk Aktif
                                    </Text>
                                    <Text size="xl" fw={800}>
                                        {stats?.totalProducts || 0}
                                    </Text>
                                </Stack>
                                <ThemeIcon
                                    size="lg"
                                    radius="md"
                                    variant="light"
                                    color="blue"
                                >
                                    <IconBox size={20} />
                                </ThemeIcon>
                            </Group>
                        </Paper>

                        {/* 2. Menunggu Validasi */}
                        <Paper
                            withBorder
                            p="md"
                            radius="md"
                            shadow="sm"
                            style={{
                                borderLeft:
                                    "4px solid var(--mantine-color-orange-6)",
                            }}
                        >
                            <Group justify="space-between">
                                <Stack gap={0}>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        fw={700}
                                        tt="uppercase"
                                    >
                                        Butuh Validasi
                                    </Text>
                                    <Text size="xl" fw={800} c="orange.9">
                                        {stats?.waitingValidation || 0}
                                    </Text>
                                </Stack>
                                <ThemeIcon
                                    size="lg"
                                    radius="md"
                                    variant="light"
                                    color="orange"
                                >
                                    <IconAlertCircle size={20} />
                                </ThemeIcon>
                            </Group>
                            {stats?.waitingValidation > 0 && (
                                <Button
                                    component={Link}
                                    href={route("staff.commission.index")}
                                    variant="subtle"
                                    color="orange"
                                    size="compact-xs"
                                    fullWidth
                                    mt="xs"
                                >
                                    Proses Sekarang{" "}
                                    <IconArrowRight
                                        size={12}
                                        style={{ marginLeft: 5 }}
                                    />
                                </Button>
                            )}
                        </Paper>

                        {/* 3. Total Omzet (Income) */}
                        <Paper
                            withBorder
                            p="md"
                            radius="md"
                            shadow="sm"
                            bg="green.0"
                            style={{
                                borderColor: "var(--mantine-color-green-3)",
                            }}
                        >
                            <Group justify="space-between">
                                <Stack gap={0}>
                                    <Text
                                        size="xs"
                                        c="green.8"
                                        fw={700}
                                        tt="uppercase"
                                    >
                                        Omzet Kotor
                                    </Text>
                                    <Text size="xl" fw={800} c="green.9">
                                        Rp{" "}
                                        {(
                                            stats?.total_omzet || 0
                                        ).toLocaleString("id-ID")}
                                    </Text>
                                </Stack>
                                <ThemeIcon
                                    size="lg"
                                    radius="md"
                                    variant="filled"
                                    color="green"
                                >
                                    <IconChartBar size={20} />
                                </ThemeIcon>
                            </Group>
                        </Paper>

                        {/* 4. Total Komisi (Expense) - BARU */}
                        <Paper
                            withBorder
                            p="md"
                            radius="md"
                            shadow="sm"
                            bg="red.0"
                            style={{
                                borderColor: "var(--mantine-color-red-3)",
                            }}
                        >
                            <Group justify="space-between">
                                <Stack gap={0}>
                                    <Text
                                        size="xs"
                                        c="red.8"
                                        fw={700}
                                        tt="uppercase"
                                    >
                                        Beban Komisi
                                    </Text>
                                    <Text size="xl" fw={800} c="red.9">
                                        Rp{" "}
                                        {(
                                            stats?.total_commission || 0
                                        ).toLocaleString("id-ID")}
                                    </Text>
                                </Stack>
                                <ThemeIcon
                                    size="lg"
                                    radius="md"
                                    variant="filled"
                                    color="red"
                                >
                                    <IconCoin size={20} />
                                </ThemeIcon>
                            </Group>
                        </Paper>
                    </SimpleGrid>

                    {/* SECTION 3: DUAL CHARTS */}
                    <Grid gutter="lg">
                        {/* CHART 1: OMZET */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Paper withBorder p="lg" radius="md" shadow="sm">
                                <Stack gap="xs">
                                    <Group justify="space-between">
                                        <Title order={4} size="sm">
                                            Tren Omzet Penjualan
                                        </Title>
                                        <Badge color="green" variant="light">
                                            Pemasukan
                                        </Badge>
                                    </Group>
                                    <Text size="xs" c="dimmed">
                                        Grafik total harga produk yang terjual.
                                    </Text>
                                    <Box h={300} mt="md">
                                        <DashboardChart
                                            data={chart_omzet}
                                            color="green"
                                        />
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid.Col>

                        {/* CHART 2: KOMISI */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Paper withBorder p="lg" radius="md" shadow="sm">
                                <Stack gap="xs">
                                    <Group justify="space-between">
                                        <Title order={4} size="sm">
                                            Tren Pembayaran Komisi
                                        </Title>
                                        <Badge color="red" variant="light">
                                            Pengeluaran
                                        </Badge>
                                    </Group>
                                    <Text size="xs" c="dimmed">
                                        Grafik total komisi yang dibayarkan ke
                                        mahasiswa.
                                    </Text>
                                    <Box h={300} mt="md">
                                        {/* Gunakan warna merah untuk konotasi pengeluaran */}
                                        <DashboardChart
                                            data={chart_commission}
                                            color="red"
                                        />
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid.Col>
                    </Grid>

                    {/* SECTION 4: CTA */}
                    <Paper
                        p="lg"
                        radius="md"
                        bg="var(--mantine-color-indigo-filled)"
                        c="white"
                    >
                        <Group justify="space-between" align="center">
                            <Box>
                                <Title order={3} size="h4">
                                    Tambah Produk Baru?
                                </Title>
                                <Text size="sm" opacity={0.9}>
                                    Semakin banyak produk, semakin besar peluang
                                    omzet Anda.
                                </Text>
                            </Box>
                            <Button
                                component={Link}
                                href={route("staff.product.create")}
                                variant="white"
                                color="indigo"
                                size="md"
                            >
                                Tambah Produk
                            </Button>
                        </Group>
                    </Paper>
                </Stack>
            </Container>
        </AuthenticatedLayout>
    );
}
