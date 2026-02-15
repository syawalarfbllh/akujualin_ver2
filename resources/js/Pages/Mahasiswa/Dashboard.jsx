import { Head, usePage } from "@inertiajs/react";
import {
    Container,
    Grid,
    Card,
    Group,
    Text as MantineText,
    Button,
    SimpleGrid,
    Badge,
    Progress,
} from "@mantine/core";
import {
    IconWallet,
    IconClick,
    IconShare,
    IconSearch,
} from "@tabler/icons-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function MahasiswaDashboard() {
    // AMBIL DATA DARI USEPAGE
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <MantineText size="xl" fw={700}>
                    Dashboard Affiliate
                </MantineText>
            }
        >
            <Head title="Mahasiswa Dashboard" />

            <Container size="xl" py="lg">
                <Card radius="md" bg="indigo" c="white" mb="xl" p="xl">
                    <Group justify="space-between" align="center">
                        <div>
                            <MantineText size="xl" fw={700}>
                                Halo, {user.name}!
                            </MantineText>
                            <MantineText size="sm" opacity={0.9}>
                                Siap mencari uang jajan tambahan hari ini?
                            </MantineText>
                        </div>
                        <Button
                            variant="white"
                            color="indigo"
                            leftSection={<IconSearch size={18} />}
                        >
                            Cari Produk
                        </Button>
                    </Group>
                </Card>

                {/* Statistik Placeholder */}
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                    <Card withBorder padding="lg">
                        <MantineText fw={700}>Dompet: Rp 0</MantineText>
                    </Card>
                    <Card withBorder padding="lg">
                        <MantineText fw={700}>Klik: 0</MantineText>
                    </Card>
                    <Card withBorder padding="lg">
                        <MantineText fw={700}>Konversi: 0</MantineText>
                    </Card>
                </SimpleGrid>
            </Container>
        </AuthenticatedLayout>
    );
}
