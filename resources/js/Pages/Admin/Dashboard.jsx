import { Head, usePage } from "@inertiajs/react";
import {
    Container,
    Card,
    Group,
    Text as MantineText,
    ThemeIcon,
    SimpleGrid,
} from "@mantine/core";
import {
    IconUsers,
    IconBuildingStore,
    IconChartBar,
    IconServer,
} from "@tabler/icons-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AdminDashboard() {
    // --- SAFE DATA FETCHING ---
    const { auth } = usePage().props;

    // Gunakan Optional Chaining (?.)
    // Jika auth undefined, user akan jadi undefined (tidak error)
    const user = auth?.user;

    // Jika data user belum ada, tampilkan Loading atau return null
    if (!user) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <MantineText>Memuat Data User...</MantineText>
            </div>
        );
    }

    const stats = [
        { title: "Total User", value: "1,234", icon: IconUsers, color: "blue" },
        {
            title: "Total UMKM",
            value: "56",
            icon: IconBuildingStore,
            color: "orange",
        },
        {
            title: "Total Transaksi",
            value: "Rp 450M",
            icon: IconChartBar,
            color: "green",
        },
        {
            title: "Server Status",
            value: "99.9%",
            icon: IconServer,
            color: "grape",
        },
    ];

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <MantineText size="xl" fw={700}>
                    Admin Overview
                </MantineText>
            }
        >
            <Head title="Admin Dashboard" />

            <Container size="xl" py="lg">
                <SimpleGrid
                    cols={{ base: 1, sm: 2, lg: 4 }}
                    spacing="lg"
                    mb="xl"
                >
                    {stats.map((stat) => (
                        <Card
                            key={stat.title}
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                        >
                            <Group justify="space-between">
                                <div>
                                    <MantineText
                                        c="dimmed"
                                        size="xs"
                                        tt="uppercase"
                                        fw={700}
                                    >
                                        {stat.title}
                                    </MantineText>
                                    <MantineText fw={700} size="xl" mt="xs">
                                        {stat.value}
                                    </MantineText>
                                </div>
                                <ThemeIcon
                                    color={stat.color}
                                    variant="light"
                                    size="xl"
                                    radius="md"
                                >
                                    <stat.icon size={24} />
                                </ThemeIcon>
                            </Group>
                        </Card>
                    ))}
                </SimpleGrid>

                <MantineText c="dimmed" align="center">
                    Selamat datang, {user.name} ({user.email})
                </MantineText>
            </Container>
        </AuthenticatedLayout>
    );
}
