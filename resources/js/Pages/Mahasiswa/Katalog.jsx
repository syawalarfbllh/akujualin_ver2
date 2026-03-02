import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Grid,
    Card,
    Image,
    Text,
    Group,
    Badge,
    Button,
    TextInput,
    ActionIcon,
    Tooltip,
    Stack,
    Modal,
    Box,
} from "@mantine/core";
import {
    IconCopy,
    IconExternalLink,
    IconSearch,
    IconCheck,
    IconMessageDots,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";

export default function Katalog({ auth, products = [], flash }) {
    const [search, setSearch] = useState("");
    const [copiedId, setCopiedId] = useState(null);
    const [opened, setOpened] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Notifikasi Sederhana
    useEffect(() => {
        if (flash?.success) {
            alert(flash.success);
        }
    }, [flash]);

    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: "",
        shopee_order_id: "",
    });

    const handleCopy = (product) => {
        const trackingUrl = `${window.location.origin}/ref/${product.id}/${auth.user.id}`;
        navigator.clipboard.writeText(trackingUrl);
        setCopiedId(product.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const openClaimModal = (product) => {
        setSelectedProduct(product);
        setData("product_id", product.id);
        setOpened(true);
    };

    const submitClaim = (e) => {
        e.preventDefault();
        post(route("mahasiswa.claim.store"), {
            onSuccess: () => {
                setOpened(false);
                reset();
            },
        });
    };

    // Filter produk dengan pengaman (jika products bukan array)
    const filteredProducts = Array.isArray(products)
        ? products.filter((p) =>
              p.name.toLowerCase().includes(search.toLowerCase()),
          )
        : [];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Katalog Produk" />

            <Stack gap="xl">
                <Group justify="space-between">
                    <Box>
                        <Text size="xl" fw={800} color="indigo">
                            Katalog Affiliate
                        </Text>
                        <Text size="sm" c="dimmed">
                            Pilih produk, sebar link, dan klaim komisimu.
                        </Text>
                    </Box>
                    <TextInput
                        placeholder="Cari produk..."
                        leftSection={<IconSearch size={16} />}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        w={{ base: "100%", sm: 300 }}
                    />
                </Group>

                {filteredProducts.length > 0 ? (
                    <Grid gutter="md">
                        {filteredProducts.map((product) => (
                            <Grid.Col
                                key={product.id}
                                span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                            >
                                <Card
                                    shadow="sm"
                                    padding="lg"
                                    radius="md"
                                    withBorder
                                >
                                    <Card.Section>
                                        <Image
                                            src={
                                                product.image
                                                    ? `/storage/${product.image}`
                                                    : null
                                            }
                                            height={160}
                                            fallbackSrc="https://placehold.co/400x200?text=No+Image"
                                        />
                                    </Card.Section>

                                    <Stack mt="md" gap="xs">
                                        <Text fw={700} truncate>
                                            {product.name}
                                        </Text>
                                        <Badge
                                            color="green"
                                            variant="light"
                                            fullWidth
                                        >
                                            Komisi: Rp{" "}
                                            {Number(
                                                product.commission_amount || 0,
                                            ).toLocaleString("id-ID")}
                                        </Badge>
                                        <Text size="lg" fw={800}>
                                            Rp{" "}
                                            {Number(
                                                product.price || 0,
                                            ).toLocaleString("id-ID")}
                                        </Text>
                                    </Stack>

                                    <Stack mt="md" gap="xs">
                                        <Group grow gap="xs">
                                            <Button
                                                leftSection={
                                                    copiedId === product.id ? (
                                                        <IconCheck size={16} />
                                                    ) : (
                                                        <IconCopy size={16} />
                                                    )
                                                }
                                                variant="light"
                                                onClick={() =>
                                                    handleCopy(product)
                                                }
                                            >
                                                {copiedId === product.id
                                                    ? "Tersalin"
                                                    : "Link"}
                                            </Button>
                                            <ActionIcon
                                                variant="outline"
                                                color="orange"
                                                size="36px"
                                                component="a"
                                                href={product.product_link}
                                                target="_blank"
                                            >
                                                <IconExternalLink size={18} />
                                            </ActionIcon>
                                        </Group>
                                        <Button
                                            fullWidth
                                            variant="filled"
                                            color="orange"
                                            leftSection={
                                                <IconMessageDots size={16} />
                                            }
                                            onClick={() =>
                                                openClaimModal(product)
                                            }
                                        >
                                            Klaim Komisi
                                        </Button>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                ) : (
                    <Paper withBorder p="xl" radius="md" ta="center">
                        <Text c="dimmed">
                            Belum ada produk yang tersedia di katalog.
                        </Text>
                    </Paper>
                )}
            </Stack>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Input Nomor Pesanan Shopee"
                centered
            >
                <form onSubmit={submitClaim}>
                    <Stack>
                        <Text size="sm">
                            Pastikan nomor pesanan sesuai dengan Shopee.
                        </Text>
                        <TextInput
                            label="Nomor Pesanan"
                            placeholder="Contoh: 240512XXXXXXXX"
                            required
                            value={data.shopee_order_id}
                            onChange={(e) =>
                                setData("shopee_order_id", e.target.value)
                            }
                            error={errors.shopee_order_id}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            loading={processing}
                            color="indigo"
                        >
                            Kirim Klaim
                        </Button>
                    </Stack>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
