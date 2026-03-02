import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
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
} from "@mantine/core";
import {
    IconBox,
    IconAlertCircle,
    IconMoneybag,
    IconArrowRight,
    IconChartLine,
} from "@tabler/icons-react";
import DashboardChart from "@/Components/DashboardChart"; // Pastikan komponen ini sudah dibuat

export default function Dashboard({ auth, stats, chart_data, filters }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Staff UMKM" />

            <Stack gap="xl">
                {/* Header Section */}
                <Group justify="space-between" align="flex-end">
                    <Box>
                        <Title order={2}>Ringkasan Toko</Title>
                        <Text c="dimmed">
                            Kelola produk dan validasi komisi mahasiswa secara
                            real-time.
                        </Text>
                    </Box>
                </Group>

                {/* Statistik Utama */}
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                    <Paper withBorder p="md" radius="md">
                        <Group>
                            <ThemeIcon
                                size="xl"
                                radius="md"
                                color="blue"
                                variant="light"
                            >
                                <IconBox size={24} />
                            </ThemeIcon>
                            <Stack gap={0}>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    fw={700}
                                    tt="uppercase"
                                >
                                    Total Produk
                                </Text>
                                <Text size="xl" fw={700}>
                                    {stats?.totalProducts || 0}
                                </Text>
                            </Stack>
                        </Group>
                    </Paper>

                    <Paper
                        withBorder
                        p="md"
                        radius="md"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <Group>
                            <ThemeIcon
                                size="xl"
                                radius="md"
                                color="orange"
                                variant="light"
                            >
                                <IconAlertCircle size={24} />
                            </ThemeIcon>
                            <Stack gap={0}>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    fw={700}
                                    tt="uppercase"
                                >
                                    Butuh Validasi
                                </Text>
                                <Text size="xl" fw={700}>
                                    {stats?.waitingValidation || 0}
                                </Text>
                            </Stack>
                        </Group>
                        <Button
                            fullWidth
                            mt="md"
                            size="compact-xs"
                            variant="light"
                            color="orange"
                            component={Link}
                            href={route("staff.commission.index")}
                        >
                            Cek Sekarang
                        </Button>
                    </Paper>

                    <Paper withBorder p="md" radius="md">
                        <Group>
                            <ThemeIcon
                                size="xl"
                                radius="md"
                                color="green"
                                variant="light"
                            >
                                <IconMoneybag size={24} />
                            </ThemeIcon>
                            <Stack gap={0}>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    fw={700}
                                    tt="uppercase"
                                >
                                    Komisi Terbayar
                                </Text>
                                <Text fw={700} size="xl">
                                    Rp{" "}
                                    {(
                                        stats?.total_transaksi || 0
                                    ).toLocaleString("id-ID")}
                                </Text>
                            </Stack>
                        </Group>
                    </Paper>
                </SimpleGrid>

                {/* Chart Section */}
                <DashboardChart
                    title="Tren Penjualan & Komisi"
                    data={chart_data}
                    filters={filters}
                    color="blue"
                />

                {/* Banner Quick Action */}
                <Paper
                    withBorder
                    p="xl"
                    radius="md"
                    bg="indigo.0"
                    style={{ borderStyle: "dashed", borderWeight: "2px" }}
                >
                    <Grid align="center">
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <Group>
                                <ThemeIcon color="indigo" size="lg" radius="xl">
                                    <IconBox size={20} />
                                </ThemeIcon>
                                <Box>
                                    <Title order={3} c="indigo.9">
                                        Tambahkan Produk Baru?
                                    </Title>
                                    <Text c="indigo.7" size="sm">
                                        Semakin banyak produk, semakin banyak
                                        peluang mahasiswa membantu penjualan
                                        Anda.
                                    </Text>
                                </Box>
                            </Group>
                        </Grid.Col>
                        <Grid.Col
                            span={{ base: 12, md: 4 }}
                            ta={{ base: "left", md: "right" }}
                        >
                            <Button
                                size="md"
                                color="indigo"
                                radius="md"
                                leftSection={<IconArrowRight size={20} />}
                                component={Link}
                                href={route("staff.product.create")}
                            >
                                Tambah Produk
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Paper>
            </Stack>
        </AuthenticatedLayout>
    );
}
