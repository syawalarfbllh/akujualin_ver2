import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Stack,
    SimpleGrid,
    Paper,
    Group,
    ThemeIcon,
    Text,
    Title,
} from "@mantine/core";
import { IconBuildingStore, IconUsers, IconCash } from "@tabler/icons-react";
import DashboardChart from "@/Components/DashboardChart";

export default function AdminDashboard({ auth, stats, chart_data, filters }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admin Dashboard" />
            <Stack gap="xl">
                <Title order={2}>Sistem Overview</Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    <StatCard
                        title="TOTAL UMKM"
                        value={stats.total_umkm}
                        icon={IconBuildingStore}
                        color="blue"
                    />
                    <StatCard
                        title="MAHASISWA"
                        value={stats.total_mahasiswa}
                        icon={IconUsers}
                        color="orange"
                    />
                    <StatCard
                        title="OMZET KOMISI"
                        value={`Rp ${stats.total_transaksi.toLocaleString("id-ID")}`}
                        icon={IconCash}
                        color="green"
                    />
                </SimpleGrid>
                <DashboardChart
                    title="Performa Penjualan Global"
                    data={chart_data}
                    filters={filters}
                    color="indigo"
                />
            </Stack>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <Paper withBorder p="md" radius="md">
            <Group>
                <ThemeIcon size="xl" color={color} variant="light">
                    <Icon />
                </ThemeIcon>
                <Stack gap={0}>
                    <Text size="xs" c="dimmed" fw={700}>
                        {title}
                    </Text>
                    <Text fw={700} size="xl">
                        {value}
                    </Text>
                </Stack>
            </Group>
        </Paper>
    );
}
