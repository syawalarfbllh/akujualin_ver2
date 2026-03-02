import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    SimpleGrid,
    Card,
    Text,
    Group,
    Button,
    Avatar,
    Stack,
    Title,
    Box,
    ActionIcon,
    Tooltip,
    Paper,
} from "@mantine/core";
import {
    IconArrowLeft,
    IconHeart,
    IconHeartOff,
    IconBrandWhatsapp,
} from "@tabler/icons-react";

export default function FavoritesPage({ auth, affiliates }) {
    const handleFavorite = (id) => {
        router.post(
            route("staff.affiliate.favorite.toggle"),
            { affiliate_id: id },
            { preserveScroll: true },
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Favorit Saya" />
            <Stack gap="xl" p="md">
                <Box>
                    <Button
                        component={Link}
                        href={route("staff.affiliate.index")}
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        mb="xs"
                    >
                        Kembali ke Marketplace
                    </Button>
                    <Title order={2} fw={900}>
                        Affiliator Favorit Saya
                    </Title>
                    <Text c="dimmed" size="sm">
                        Daftar affiliator yang Anda tandai untuk kolaborasi
                        mendatang.
                    </Text>
                </Box>

                {affiliates.length > 0 ? (
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                        <AnimatePresence>
                            {affiliates.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout // Animasi saat kartu lain dihapus
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.5,
                                        transition: { duration: 0.2 },
                                    }}
                                >
                                    <Card
                                        withBorder
                                        padding="xl"
                                        radius="md"
                                        shadow="sm"
                                    >
                                        {/* Header Card dengan Tombol Hapus Favorit */}
                                        <Card.Section
                                            withBorder
                                            inheritPadding
                                            py="xs"
                                            bg="gray.0"
                                        >
                                            <Group justify="right">
                                                <ActionIcon
                                                    color="red"
                                                    variant="filled"
                                                    onClick={() =>
                                                        handleFavorite(item.id)
                                                    }
                                                >
                                                    <IconHeart
                                                        size={18}
                                                        fill="white"
                                                    />
                                                </ActionIcon>
                                            </Group>
                                        </Card.Section>

                                        <Stack align="center" mt="md">
                                            <Avatar
                                                src={item.avatar}
                                                size={80}
                                                radius="100%"
                                            />
                                            <Title order={4}>{item.name}</Title>
                                            <Text
                                                size="xs"
                                                c="dimmed"
                                                ta="center"
                                            >
                                                {item.bio}
                                            </Text>
                                        </Stack>

                                        <Button
                                            fullWidth
                                            mt="md"
                                            variant="light"
                                            color="green"
                                            leftSection={
                                                <IconBrandWhatsapp size={18} />
                                            }
                                            component="a"
                                            href={`https://wa.me/${item.whatsapp}`}
                                            target="_blank"
                                        >
                                            Hubungi Sekarang
                                        </Button>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </SimpleGrid>
                ) : (
                    <Paper withBorder p={50} radius="md" ta="center">
                        <IconHeartOff size={50} stroke={1.5} color="gray" />
                        <Text fw={500} mt="md">
                            Belum ada favorit
                        </Text>
                        <Text size="sm" c="dimmed">
                            Affiliator yang Anda sukai akan muncul di sini.
                        </Text>
                    </Paper>
                )}
            </Stack>
        </AuthenticatedLayout>
    );
}
