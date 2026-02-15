import { Head, usePage } from "@inertiajs/react";
import {
    Container,
    Title,
    Text as MantineText,
    Button,
    Card,
    Group,
    Badge,
    Alert,
    SimpleGrid,
    ThemeIcon,
} from "@mantine/core";
import {
    IconBrandShopee,
    IconAlertCircle,
    IconCheck,
    IconPackage,
    IconRefresh,
    IconUsers,
    IconWallet,
} from "@tabler/icons-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function StaffDashboard() {
    // AMBIL DATA LENGKAP DARI USEPAGE
    const { auth, flash } = usePage().props;
    const user = auth.user;

    // Safety check untuk data shop
    const shop = auth.shop || user.shop;
    const isConnected = shop && shop.is_linked == 1;

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <MantineText size="xl" fw={700}>
                    Dashboard UMKM
                </MantineText>
            }
        >
            <Head title="Staff Dashboard" />

            <Container size="xl" py="lg">
                {flash.success && (
                    <Alert
                        variant="light"
                        color="green"
                        title="Sukses"
                        icon={<IconCheck />}
                        mb="md"
                    >
                        {flash.success}
                    </Alert>
                )}

                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    mb="xl"
                    style={{ borderLeft: "5px solid #ee4d2d" }}
                >
                    <Group justify="space-between">
                        <div>
                            <Group>
                                <IconBrandShopee size={32} color="#ee4d2d" />
                                <MantineText fw={700} size="lg">
                                    Integrasi Marketplace
                                </MantineText>
                            </Group>
                            <MantineText c="dimmed" size="sm" mt="xs" maw={600}>
                                {isConnected
                                    ? `Terhubung: ${shop?.shop_name}`
                                    : "Hubungkan toko Shopee Anda."}
                            </MantineText>
                        </div>

                        {isConnected ? (
                            <Badge size="lg" color="green" variant="light">
                                Status: Terhubung
                            </Badge>
                        ) : (
                            <Button
                                component="a"
                                href={
                                    window.location.hostname === "localhost" ||
                                    window.location.hostname === "127.0.0.1"
                                        ? route("staff.shopee.bypass")
                                        : route("staff.shopee.connect")
                                }
                                color="orange"
                                leftSection={<IconBrandShopee size={20} />}
                            >
                                Hubungkan Shopee
                            </Button>
                        )}
                    </Group>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
