import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Grid,
    Paper,
    Text,
    Group,
    Stack,
    SimpleGrid,
    Title,
    Box,
    Button,
    ThemeIcon,
    Container,
    Badge,
    ActionIcon,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
    IconBuildingStore,
    IconSchool,
    IconChartLine,
    IconMoneybag,
    IconCalendar,
    IconFilter,
    IconAlertCircle,
    IconUsers,
} from "@tabler/icons-react";
import DashboardChart from "@/Components/DashboardChart";
import { useState } from "react";
import dayjs from "dayjs";

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
                route("dashboard"),
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
            <Head title="Admin Dashboard" />

            <Container size="xl" px={{ base: 0, sm: "md" }}>
                <Stack gap="lg">
                    {/* SECTION 1: HEADER & FILTER */}
                    <Paper p="md" radius="md" withBorder shadow="xs">
                        <Grid align="center" gutter="md">
                            <Grid.Col span={{ base: 12, md: 7 }}>
                                <Group gap="xs">
                                    <Title order={3} fw={700}>
                                        Dashboard Admin
                                    </Title>
                                    <Badge
                                        variant="light"
                                        color="red"
                                        size="sm"
                                    >
                                        Super Admin
                                    </Badge>
                                </Group>
                                <Text c="dimmed" size="sm" mt={4}>
                                    Overview performa ekosistem platform Anda.
                                </Text>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 5 }}>
                                <Group gap="xs" align="center" wrap="nowrap">
                                    <DatePickerInput
                                        type="range"
                                        placeholder="Filter Periode"
                                        value={dateRange}
                                        onChange={setDateRange}
                                        leftSection={<IconCalendar size={14} />}
                                        size="sm"
                                        style={{ flex: 1 }}
                                    />
                                    <Button
                                        onClick={handleFilter}
                                        color="indigo"
                                        variant="light"
                                        size="sm"
                                        px="sm"
                                    >
                                        <IconFilter size={16} />
                                    </Button>
                                </Group>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* SECTION 2: STATS CARDS (Refined UI) */}
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                        <StatCard
                            title="Total Seller"
                            value={stats.total_umkm}
                            icon={IconBuildingStore}
                            color="blue"
                            subtext="Mitra UMKM Aktif"
                        />
                        <StatCard
                            title="Total Mahasiswa"
                            value={stats.total_mahasiswa}
                            icon={IconSchool}
                            color="cyan"
                            subtext="Affiliator Terdaftar"
                        />
                        <StatCard
                            title="Omzet (GMV)"
                            value={stats.total_omzet}
                            icon={IconChartLine}
                            color="teal"
                            subtext="Total Transaksi"
                            isCurrency
                        />
                        <StatCard
                            title="Total Payout"
                            value={stats.total_payout}
                            icon={IconMoneybag}
                            color="grape"
                            subtext="Komisi Cair"
                            isCurrency
                        />
                    </SimpleGrid>

                    {/* ALERT BOX: JIKA ADA PENDING COMMISSION */}
                    {stats.total_pending > 0 && (
                        <Paper
                            withBorder
                            p="sm"
                            radius="md"
                            bg="orange.0"
                            style={{
                                borderColor: "var(--mantine-color-orange-3)",
                            }}
                        >
                            <Group justify="space-between">
                                <Group gap="sm">
                                    <IconAlertCircle
                                        size={20}
                                        color="var(--mantine-color-orange-8)"
                                    />
                                    <Text size="sm" c="orange.9">
                                        Terdapat{" "}
                                        <b>
                                            {stats.total_pending} klaim komisi
                                            pending
                                        </b>
                                        . Mohon tinjau validasi seller.
                                    </Text>
                                </Group>
                                <Button
                                    component={Link}
                                    href={route("admin.claims.index")}
                                    color="orange"
                                    variant="subtle"
                                    size="xs"
                                    compact
                                >
                                    Cek Data &rarr;
                                </Button>
                            </Group>
                        </Paper>
                    )}

                    {/* SECTION 3: CHARTS */}
                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Paper withBorder p="md" radius="md" shadow="sm">
                                <Group justify="space-between" mb="md">
                                    <Box>
                                        <Text fw={600} size="md">
                                            Tren Omzet Nasional
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            Gross Merchandise Value
                                        </Text>
                                    </Box>
                                    <Badge
                                        color="teal"
                                        variant="light"
                                        size="sm"
                                    >
                                        Growth
                                    </Badge>
                                </Group>
                                <Box h={300}>
                                    <DashboardChart
                                        data={chart_omzet}
                                        color="teal"
                                    />
                                </Box>
                            </Paper>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Paper withBorder p="md" radius="md" shadow="sm">
                                <Group justify="space-between" mb="md">
                                    <Box>
                                        <Text fw={600} size="md">
                                            Arus Keluar Komisi
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            Pembayaran ke Mahasiswa
                                        </Text>
                                    </Box>
                                    <Badge
                                        color="grape"
                                        variant="light"
                                        size="sm"
                                    >
                                        Payout
                                    </Badge>
                                </Group>
                                <Box h={300}>
                                    <DashboardChart
                                        data={chart_commission}
                                        color="grape"
                                    />
                                </Box>
                            </Paper>
                        </Grid.Col>
                    </Grid>

                    {/* SECTION 4: QUICK LINKS (Compact) */}
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                        <Paper
                            p="md"
                            radius="md"
                            withBorder
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                router.visit(route("admin.monitor.staff"))
                            }
                            bg="gray.0"
                        >
                            <Group justify="space-between">
                                <Group>
                                    <ThemeIcon
                                        size="lg"
                                        radius="md"
                                        variant="white"
                                        color="blue"
                                    >
                                        <IconUsers size={20} />
                                    </ThemeIcon>
                                    <Box>
                                        <Text fw={600} size="sm">
                                            Monitor Staff UMKM
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            Cek performa seller terbaik
                                        </Text>
                                    </Box>
                                </Group>
                                <IconUsers
                                    size={18}
                                    color="gray"
                                    style={{ opacity: 0.5 }}
                                />
                            </Group>
                        </Paper>

                        <Paper
                            p="md"
                            radius="md"
                            withBorder
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                router.visit(route("admin.monitor.mahasiswa"))
                            }
                            bg="gray.0"
                        >
                            <Group justify="space-between">
                                <Group>
                                    <ThemeIcon
                                        size="lg"
                                        radius="md"
                                        variant="white"
                                        color="cyan"
                                    >
                                        <IconSchool size={20} />
                                    </ThemeIcon>
                                    <Box>
                                        <Text fw={600} size="sm">
                                            Monitor Mahasiswa
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            Cek affiliator teraktif
                                        </Text>
                                    </Box>
                                </Group>
                                <IconSchool
                                    size={18}
                                    color="gray"
                                    style={{ opacity: 0.5 }}
                                />
                            </Group>
                        </Paper>
                    </SimpleGrid>
                </Stack>
            </Container>
        </AuthenticatedLayout>
    );
}

// COMPONENT: STAT CARD (REFINED)
// Menggunakan Text size custom daripada Title agar tidak terlalu bold/besar
function StatCard({
    title,
    value,
    icon: Icon,
    color,
    subtext,
    isCurrency = false,
}) {
    // Format value jika currency
    const displayValue = isCurrency
        ? `Rp ${(value || 0).toLocaleString("id-ID")}`
        : value;

    return (
        <Paper withBorder p="md" radius="md" shadow="xs">
            <Group justify="space-between" align="flex-start" mb={4}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase" ls={0.5}>
                    {title}
                </Text>
                <ThemeIcon size="md" radius="sm" variant="light" color={color}>
                    <Icon size={16} />
                </ThemeIcon>
            </Group>

            <Group align="flex-end" gap="xs">
                <Text
                    fw={700}
                    style={{ fontSize: "22px", lineHeight: 1.2 }} // Ukuran font custom, tidak terlalu besar
                    c="dark.7"
                >
                    {displayValue}
                </Text>
            </Group>

            {subtext && (
                <Text size="xs" c="dimmed" mt={4}>
                    {subtext}
                </Text>
            )}
        </Paper>
    );
}
