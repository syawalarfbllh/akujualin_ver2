import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Title,
    Text,
    Paper,
    SimpleGrid,
    Card,
    AspectRatio,
    Button,
    Group,
    Badge,
    Stack,
    ActionIcon,
    Tooltip,
    Box,
    ThemeIcon,
} from "@mantine/core";
import {
    IconDownload,
    IconPlayerPlay,
    IconBrandTiktok,
    IconCopy,
    IconVideo,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

export default function ContentLibrary({ auth, videos }) {
    const copyAffiliateLink = (productId) => {
        // Logika sederhana untuk copy link affiliate
        // Sesuaikan dengan route link affiliate kamu
        const link = `${window.location.origin}/share/${auth.user.id}/${productId}`;
        navigator.clipboard.writeText(link);
        notifications.show({
            title: "Link Disalin!",
            message: "Tempel link ini di bio atau deskripsi video kamu.",
            color: "teal",
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gudang Konten Afiliasi" />

            <Stack gap="xl">
                {/* Welcome Header */}
                <Paper p="xl" radius="md" bg="indigo.6" c="white">
                    <Group justify="space-between">
                        <Box>
                            <Title order={2}>Gudang Konten Kreator 🎬</Title>
                            <Text size="sm" opacity={0.8}>
                                Download video pilihan UMKM, posting di sosmed,
                                dan dapatkan komisinya!
                            </Text>
                        </Box>
                        <ThemeIcon
                            size={50}
                            radius="md"
                            variant="white"
                            color="indigo"
                        >
                            <IconVideo size={30} />
                        </ThemeIcon>
                    </Group>
                </Paper>

                {/* Video Grid */}
                {videos.length === 0 ? (
                    <Paper withBorder p="50" ta="center" radius="md">
                        <Text c="dimmed">
                            Belum ada konten video yang tersedia saat ini.
                        </Text>
                    </Paper>
                ) : (
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                        {videos.map((v) => (
                            <Card
                                key={v.id}
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                            >
                                <Card.Section>
                                    <AspectRatio ratio={9 / 16}>
                                        <video
                                            src={`/storage/${v.video_path}`}
                                            controls
                                            style={{ backgroundColor: "#000" }}
                                        />
                                    </AspectRatio>
                                </Card.Section>

                                <Stack gap="xs" mt="md">
                                    <Group
                                        justify="space-between"
                                        wrap="nowrap"
                                    >
                                        <Text fw={700} size="md" truncate>
                                            {v.title}
                                        </Text>
                                        <Badge variant="light" color="grape">
                                            {v.user?.name || "Seller"}
                                        </Badge>
                                    </Group>

                                    {v.product && (
                                        <Badge
                                            color="blue"
                                            variant="dot"
                                            size="sm"
                                        >
                                            Produk: {v.product.name}
                                        </Badge>
                                    )}

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        lineClamp={3}
                                        h={60}
                                    >
                                        {v.description ||
                                            "Tidak ada deskripsi tambahan."}
                                    </Text>
                                </Stack>

                                <Card.Section p="md">
                                    <Group grow gap="xs">
                                        <Button
                                            variant="filled"
                                            color="indigo"
                                            leftSection={
                                                <IconDownload size={16} />
                                            }
                                            component="a"
                                            href={`/storage/${v.video_path}`}
                                            download={`${v.title}.mp4`}
                                        >
                                            Download
                                        </Button>

                                        {v.product_id && (
                                            <Tooltip label="Salin Link Affiliate">
                                                <ActionIcon
                                                    variant="light"
                                                    color="blue"
                                                    size="lg"
                                                    onClick={() =>
                                                        copyAffiliateLink(
                                                            v.product_id,
                                                        )
                                                    }
                                                >
                                                    <IconCopy size={20} />
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </Group>
                                </Card.Section>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
            </Stack>
        </AuthenticatedLayout>
    );
}
