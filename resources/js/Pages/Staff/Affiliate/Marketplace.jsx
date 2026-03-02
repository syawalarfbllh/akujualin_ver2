import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    SimpleGrid,
    Card,
    Image,
    Text,
    Group,
    Badge,
    Button,
    ActionIcon,
    Avatar,
    Stack,
    Title,
    TextInput,
    Box,
    Paper,
    Tooltip,
} from "@mantine/core";
import {
    IconSearch,
    IconBrandWhatsapp,
    IconHeart,
    IconChartBar,
    IconExternalLink,
    IconUsers,
    IconClick,
} from "@tabler/icons-react";

export default function AffiliateMarketplace({ auth, affiliates }) {
    // Dummy data jika props affiliates belum dikirim dari Controller
    const demoAffiliates = [
        {
            id: 1,
            name: "Andi Saputra",
            avatar: null,
            rank: 1,
            ig_followers: "12.5k",
            total_clicks: "5.2k",
            total_orders: 142,
            whatsapp: "628123456789",
            bio: "Fokus konten gadget dan lifestyle mahasiswa.",
        },
        // ... data lainnya
    ];

    const list = affiliates || demoAffiliates;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Affiliate Marketplace" />

            <Stack gap="xl">
                {/* HEADER & SEARCH */}
                <Box>
                    <Title order={2} fw={900}>
                        Affiliate Marketplace
                    </Title>
                    <Text c="dimmed">
                        Temukan mahasiswa kreatif untuk mempromosikan produk
                        Anda.
                    </Text>
                </Box>

                <Paper withBorder p="md" radius="md">
                    <TextInput
                        placeholder="Cari affiliator berdasarkan nama atau spesialisasi..."
                        leftSection={<IconSearch size={18} />}
                        size="md"
                        radius="md"
                    />
                </Paper>

                {/* GRID DAFTAR AFFILIATOR */}
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                    {list.map((item) => (
                        <Card
                            key={item.id}
                            withBorder
                            padding="lg"
                            radius="md"
                            shadow="sm"
                        >
                            <Card.Section withBorder inheritPadding py="xs">
                                <Group justify="space-between">
                                    <Badge
                                        variant="light"
                                        color="orange"
                                        leftSection="# "
                                    >
                                        Rank {item.rank}
                                    </Badge>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        radius="md"
                                    >
                                        <IconHeart size={20} stroke={1.5} />
                                    </ActionIcon>
                                </Group>
                            </Card.Section>

                            <Group mt="md" wrap="nowrap">
                                <Avatar
                                    src={item.avatar}
                                    size={80}
                                    radius="md"
                                    color="blue"
                                >
                                    {item.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Text fw={700} size="lg">
                                        {item.name}
                                    </Text>
                                    <Text size="xs" c="dimmed" lineClamp={1}>
                                        {item.bio}
                                    </Text>
                                </Box>
                            </Group>

                            <Divider
                                my="md"
                                label="Statistik Performa"
                                labelPosition="center"
                            />

                            <SimpleGrid cols={2} spacing="xs">
                                <Paper
                                    withBorder
                                    p="xs"
                                    radius="sm"
                                    bg="gray.0"
                                >
                                    <Group gap={5}>
                                        <IconUsers size={14} color="blue" />
                                        <Text size="xs" fw={700}>
                                            {item.ig_followers}
                                        </Text>
                                    </Group>
                                    <Text size="10px" c="dimmed">
                                        Followers IG
                                    </Text>
                                </Paper>
                                <Paper
                                    withBorder
                                    p="xs"
                                    radius="sm"
                                    bg="gray.0"
                                >
                                    <Group gap={5}>
                                        <IconClick size={14} color="green" />
                                        <Text size="xs" fw={700}>
                                            {item.total_clicks}
                                        </Text>
                                    </Group>
                                    <Text size="10px" c="dimmed">
                                        Total Klik
                                    </Text>
                                </Paper>
                            </SimpleGrid>

                            <Group grow mt="lg" gap="sm">
                                <Button
                                    component="a"
                                    href={`https://wa.me/${item.whatsapp}`}
                                    target="_blank"
                                    leftSection={
                                        <IconBrandWhatsapp size={18} />
                                    }
                                    color="green"
                                    variant="light"
                                    radius="md"
                                >
                                    WhatsApp
                                </Button>
                                <Button
                                    variant="filled"
                                    color="blue"
                                    radius="md"
                                    rightSection={
                                        <IconExternalLink size={16} />
                                    }
                                >
                                    Profil
                                </Button>
                            </Group>
                        </Card>
                    ))}
                </SimpleGrid>
            </Stack>
        </AuthenticatedLayout>
    );
}

// Jangan lupa Divider jika Anda menggunakannya, import di atas
import { Divider } from "@mantine/core";
