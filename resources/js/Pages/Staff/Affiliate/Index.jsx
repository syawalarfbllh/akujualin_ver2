import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react"; // Tambahkan router di sini
import { motion, AnimatePresence } from "framer-motion"; // Tambahkan AnimatePresence
import {
    SimpleGrid,
    Card,
    Text,
    Group,
    Badge,
    Button,
    Avatar,
    Stack,
    Title,
    TextInput,
    Box,
    Paper,
    Divider,
    ActionIcon,
    Tooltip,
    ThemeIcon,
} from "@mantine/core";
import {
    IconSearch,
    IconBrandWhatsapp,
    IconHeart,
    IconShoppingCart,
    IconCaretUp,
    IconExternalLink,
    IconFilter,
    IconChartBar,
    IconUsers,
    IconBrandTiktok,
} from "@tabler/icons-react";

export default function AffiliateMarketplace({ auth, affiliates }) {
    const formatNumber = (value) => {
        if (value === null || value === undefined) return "0";
        let num = value;
        if (typeof value === "string") {
            if (
                value.toLowerCase().includes("k") ||
                value.toLowerCase().includes("m")
            )
                return value.toUpperCase();
            num = parseFloat(value.replace(/[^0-9]/g, ""));
        }
        if (isNaN(num)) return "0";
        if (num >= 1000000)
            return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
        if (num >= 1000)
            return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
        return num.toString();
    };

    const formatRupiah = (value) => {
        if (value === null || value === undefined) return "Rp 0";
        let num =
            typeof value === "string"
                ? parseFloat(value.replace(/[^0-9]/g, ""))
                : value;
        if (isNaN(num)) return "Rp 0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(num);
    };

    const handleFavorite = (id) => {
        router.post(
            route("staff.affiliate.favorite.toggle"),
            { affiliate_id: id },
            { preserveScroll: true },
        );
    };

    const dataDisplay = affiliates || [];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Affiliate Marketplace" />

            <Stack gap="xl" p="md">
                <Group justify="space-between" align="flex-end">
                    <Box>
                        <Title order={2} fw={900} lts="-0.5px">
                            Affiliate Marketplace
                        </Title>
                        <Text c="dimmed" size="sm">
                            Cari mahasiswa terbaik untuk promosi produk Anda.
                        </Text>
                    </Box>
                    {/* Link ke halaman favorit */}
                    <Button
                        variant="light"
                        color="red"
                        leftSection={
                            <IconHeart size={18} fill="currentColor" />
                        }
                        component={Link}
                        href={route("staff.affiliate.favorites")}
                        radius="md"
                    >
                        Favorit Saya
                    </Button>
                </Group>

                <Paper withBorder p="md" radius="md" shadow="xs">
                    <Group grow>
                        <TextInput
                            placeholder="Cari nama..."
                            leftSection={<IconSearch size={18} stroke={1.5} />}
                            radius="md"
                        />
                        <Button
                            variant="light"
                            leftSection={<IconFilter size={18} />}
                            radius="md"
                            style={{ maxWidth: 150 }}
                        >
                            Filter
                        </Button>
                    </Group>
                </Paper>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                    <AnimatePresence>
                        {dataDisplay.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05,
                                }}
                                whileHover={{ y: -5 }} // Efek melayang saat hover
                            >
                                <Card
                                    withBorder
                                    padding="xl"
                                    radius="md"
                                    shadow="sm"
                                >
                                    <Card.Section
                                        withBorder
                                        inheritPadding
                                        py="xs"
                                        bg="gray.0"
                                    >
                                        <Group justify="space-between">
                                            <Group gap={5}>
                                                <IconCaretUp
                                                    size={18}
                                                    color="green"
                                                    stroke={3}
                                                />
                                                <Text
                                                    size="xs"
                                                    fw={700}
                                                    c="dimmed"
                                                >
                                                    RANK #{item.rank || "?"}
                                                </Text>
                                            </Group>

                                            {/* Tombol Favorit dengan Animasi Pop */}
                                            <Tooltip
                                                label={
                                                    item.is_favorite
                                                        ? "Hapus dari Favorit"
                                                        : "Tambah ke Favorit"
                                                }
                                            >
                                                <motion.div
                                                    whileTap={{ scale: 1.5 }}
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    <ActionIcon
                                                        variant={
                                                            item.is_favorite
                                                                ? "filled"
                                                                : "subtle"
                                                        }
                                                        color="red"
                                                        radius="md"
                                                        size="lg"
                                                        onClick={() =>
                                                            handleFavorite(
                                                                item.id,
                                                            )
                                                        }
                                                    >
                                                        <IconHeart
                                                            size={22}
                                                            fill={
                                                                item.is_favorite
                                                                    ? "white"
                                                                    : "transparent"
                                                            }
                                                        />
                                                    </ActionIcon>
                                                </motion.div>
                                            </Tooltip>
                                        </Group>
                                    </Card.Section>

                                    <Stack align="center" mt="md">
                                        <Avatar
                                            src={item.avatar}
                                            size={100}
                                            radius="100%"
                                            color="blue"
                                        >
                                            {item.name?.charAt(0)}
                                        </Avatar>
                                        <Box ta="center">
                                            <Title order={4} fw={800}>
                                                {item.name}
                                            </Title>
                                            <Text
                                                size="xs"
                                                c="dimmed"
                                                lineClamp={2}
                                                mt={4}
                                            >
                                                {item.bio}
                                            </Text>
                                        </Box>
                                    </Stack>

                                    <Divider
                                        my="lg"
                                        label="Performa Penjualan"
                                        labelPosition="center"
                                    />

                                    <SimpleGrid cols={2} spacing="xs">
                                        <StatsBox
                                            icon={IconUsers}
                                            color="pink"
                                            value={formatNumber(
                                                item.ig_followers,
                                            )}
                                            label="IG Followers"
                                        />
                                        <StatsBox
                                            icon={IconBrandTiktok}
                                            color="dark"
                                            value={formatNumber(
                                                item.tiktok_followers,
                                            )}
                                            label="TikTok Followers"
                                        />
                                        <StatsBox
                                            icon={IconShoppingCart}
                                            color="orange"
                                            value={formatNumber(
                                                item.total_orders,
                                            )}
                                            label="Order Masuk"
                                        />
                                        <StatsBox
                                            icon={IconChartBar}
                                            color="green"
                                            value={formatRupiah(
                                                item.total_sales_value,
                                            )}
                                            label="Nilai Jual"
                                        />
                                    </SimpleGrid>

                                    <Stack mt="xl" gap="xs">
                                        <Button
                                            fullWidth
                                            component={Link}
                                            href={route(
                                                "staff.affiliate.show",
                                                item.id,
                                            )}
                                            variant="filled"
                                            radius="md"
                                            rightSection={
                                                <IconExternalLink size={16} />
                                            }
                                        >
                                            Lihat Detail Profil
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="light"
                                            color="green"
                                            radius="md"
                                            leftSection={
                                                <IconBrandWhatsapp size={18} />
                                            }
                                            component="a"
                                            href={`https://wa.me/${item.whatsapp}`}
                                            target="_blank"
                                        >
                                            WhatsApp
                                        </Button>
                                    </Stack>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </SimpleGrid>
            </Stack>
        </AuthenticatedLayout>
    );
}

// Komponen StatsBox (tetap sama)
function StatsBox({ icon: Icon, color, value, label }) {
    return (
        <Paper withBorder p="xs" radius="md" bg="gray.0">
            <Group gap="xs" wrap="nowrap">
                <ThemeIcon color={color} variant="light" size="sm">
                    <Icon size={12} />
                </ThemeIcon>
                <Text size="xs" fw={700} truncate>
                    {value}
                </Text>
            </Group>
            <Text size="10px" c="dimmed" mt={2}>
                {label}
            </Text>
        </Paper>
    );
}
