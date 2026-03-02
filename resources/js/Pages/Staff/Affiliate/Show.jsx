import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Container,
    Grid,
    Paper,
    Avatar,
    Text,
    Title,
    Group,
    Stack,
    Badge,
    Button,
    ThemeIcon,
    SimpleGrid,
    Divider,
    Box,
} from "@mantine/core";
import {
    IconBrandWhatsapp,
    IconBrandInstagram,
    IconBrandTiktok,
    IconClick,
    IconShoppingCart,
    IconChartBar,
    IconArrowLeft,
    IconCalendarStats,
} from "@tabler/icons-react";

export default function AffiliateShow({ auth, affiliate }) {
    // Fungsi untuk merubah 10000 -> 10K, 1000000 -> 1M
    const formatNumber = (num) => {
        if (!num || isNaN(num)) return "0";
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
        }
        return num.toString();
    };

    const conversionRate =
        affiliate.total_clicks > 0
            ? ((affiliate.total_orders / affiliate.total_clicks) * 100).toFixed(
                  2,
              )
            : "0.00";

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Profil ${affiliate.name}`} />

            <Container size="lg" py="xl">
                <Button
                    component={Link}
                    href={route("staff.affiliate.index")}
                    variant="subtle"
                    leftSection={<IconArrowLeft size={16} />}
                    mb="xl"
                    c="dimmed"
                >
                    Kembali ke Marketplace
                </Button>

                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack gap="lg">
                            <Paper withBorder p="xl" radius="md" ta="center">
                                <Avatar
                                    src={affiliate.avatar}
                                    size={120}
                                    radius="100%"
                                    mx="auto"
                                    color="blue"
                                >
                                    {affiliate.name?.charAt(0) || "U"}
                                </Avatar>
                                <Title order={3} mt="md" fw={800}>
                                    {affiliate.name}
                                </Title>
                                <Badge
                                    size="lg"
                                    variant="light"
                                    color="blue"
                                    mt="xs"
                                >
                                    Rank #{affiliate.rank || "N/A"}
                                </Badge>

                                <Divider my="lg" />

                                <Stack gap="sm">
                                    <Button
                                        fullWidth
                                        color="green"
                                        leftSection={
                                            <IconBrandWhatsapp size={20} />
                                        }
                                        component="a"
                                        href={`https://wa.me/${affiliate.whatsapp}`}
                                        target="_blank"
                                    >
                                        Hubungi WhatsApp
                                    </Button>

                                    <Group grow>
                                        <Button
                                            variant="light"
                                            color="pink"
                                            leftSection={
                                                <IconBrandInstagram size={18} />
                                            }
                                            component="a"
                                            href={`https://instagram.com/${affiliate.instagram_username}`}
                                            target="_blank"
                                            disabled={
                                                !affiliate.instagram_username
                                            }
                                        >
                                            Instagram
                                        </Button>
                                        <Button
                                            variant="light"
                                            color="dark"
                                            leftSection={
                                                <IconBrandTiktok size={18} />
                                            }
                                            component="a"
                                            href={`https://tiktok.com/@${affiliate.tiktok_username}`}
                                            target="_blank"
                                            disabled={
                                                !affiliate.tiktok_username
                                            }
                                        >
                                            TikTok
                                        </Button>
                                    </Group>
                                </Stack>
                            </Paper>

                            <Paper withBorder p="lg" radius="md">
                                <Title order={5} mb="sm">
                                    Tentang Affiliator
                                </Title>
                                <Text
                                    size="sm"
                                    c="dimmed"
                                    style={{ lineHeight: 1.6 }}
                                >
                                    {affiliate.bio ||
                                        "Affiliator ini belum menuliskan bio portofolio."}
                                </Text>
                            </Paper>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Stack gap="lg">
                            <Title order={4} fw={700}>
                                Statistik Performa Keseluruhan
                            </Title>

                            <SimpleGrid cols={{ base: 1, sm: 3 }}>
                                <StatsCard
                                    label="Total Klik"
                                    value={formatNumber(affiliate.total_clicks)}
                                    icon={IconClick}
                                    color="blue"
                                />
                                <StatsCard
                                    label="Produk Terjual"
                                    value={formatNumber(affiliate.total_orders)}
                                    icon={IconShoppingCart}
                                    color="teal"
                                />
                                <StatsCard
                                    label="Nilai Penjualan"
                                    value={`Rp ${new Intl.NumberFormat("id-ID").format(affiliate.total_sales || 0)}`}
                                    icon={IconChartBar}
                                    color="green"
                                />
                            </SimpleGrid>

                            <Paper withBorder p="xl" radius="md">
                                <Group mb="xl">
                                    <ThemeIcon
                                        size="lg"
                                        radius="md"
                                        variant="light"
                                        color="orange"
                                    >
                                        <IconCalendarStats size={20} />
                                    </ThemeIcon>
                                    <Box>
                                        <Text fw={700}>
                                            Analisis Kerja Sama
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            Data validasi histori sistem
                                        </Text>
                                    </Box>
                                </Group>

                                <Stack gap={0}>
                                    <DetailRow
                                        label="Followers Instagram"
                                        value={formatNumber(
                                            affiliate.ig_followers,
                                        )}
                                    />
                                    <DetailRow
                                        label="Followers TikTok"
                                        value={formatNumber(
                                            affiliate.tiktok_followers,
                                        )}
                                    />
                                    <DetailRow
                                        label="Rata-rata Konversi"
                                        value={`${conversionRate}%`}
                                    />
                                    <DetailRow
                                        label="Bergabung Sejak"
                                        value={
                                            affiliate.created_at
                                                ? new Date(
                                                      affiliate.created_at,
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          month: "long",
                                                          year: "numeric",
                                                      },
                                                  )
                                                : "-"
                                        }
                                        isLast
                                    />
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
        </AuthenticatedLayout>
    );
}

// Komponen Kecil DetailRow & StatsCard tetap sama seperti sebelumnya...
function DetailRow({ label, value, isLast }) {
    return (
        <Group
            justify="space-between"
            p="sm"
            style={{ borderBottom: isLast ? "none" : "1px solid #f1f3f5" }}
        >
            <Text size="sm" fw={500} c="dimmed">
                {label}
            </Text>
            <Text size="sm" fw={700}>
                {value}
            </Text>
        </Group>
    );
}

function StatsCard({ label, value, icon: Icon, color }) {
    return (
        <Paper withBorder p="md" radius="md">
            <Group wrap="nowrap">
                <ThemeIcon size="lg" radius="md" variant="light" color={color}>
                    <Icon size={20} />
                </ThemeIcon>
                <Box>
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                        {label}
                    </Text>
                    <Text fw={800} size="lg">
                        {value}
                    </Text>
                </Box>
            </Group>
        </Paper>
    );
}
