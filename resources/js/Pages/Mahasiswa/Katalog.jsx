import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useClipboard } from "@mantine/hooks";
import { Head, useForm } from "@inertiajs/react";
import {
    SimpleGrid,
    Card,
    Image,
    Text,
    Group,
    Badge,
    Button,
    Stack,
    Title,
    TextInput,
    Box,
    Modal,
    AspectRatio,
    Divider,
    Grid,
    Paper,
    Alert,
    FileInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconSearch,
    IconDownload,
    IconCopy,
    IconInfoCircle,
    IconMovie,
    IconCheck,
    IconAlertCircle,
    IconPhoto,
} from "@tabler/icons-react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

export default function Katalog({ auth, products }) {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [search, setSearch] = useState("");

    const clipboard = useClipboard({ timeout: 2000 });

    // Inisialisasi Form Klaim (Tambahkan proof_image)
    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: "",
        shopee_order_id: "",
        proof_image: null,
    });

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
    );

    const handleOpenDetail = (product) => {
        setSelectedProduct(product);
        setData("product_id", product.id); // Set product_id ke form saat modal dibuka
        open();
    };

    const handleClaimSubmit = (e) => {
        e.preventDefault();

        // Sesuaikan nama route dengan web.php Anda (mahasiswa.claim.store)
        post(route("mahasiswa.claim.store"), {
            forceFormData: true, // WAJIB ADA AGAR FILE BISA TERKIRIM
            onSuccess: () => {
                reset("shopee_order_id", "proof_image"); // Reset inputan setelah sukses
                notifications.show({
                    title: "Klaim Terkirim",
                    message:
                        "Nomor pesanan beserta bukti sedang dalam verifikasi admin.",
                    color: "teal",
                    icon: <IconCheck size={16} />,
                });
                close(); // Tutup modal setelah berhasil
            },
            onError: (err) => {
                console.error(err);
                notifications.show({
                    title: "Gagal Klaim",
                    message:
                        "Periksa kembali data Anda, pastikan gambar maksimal 2MB.",
                    color: "red",
                    icon: <IconAlertCircle size={16} />,
                });
            },
        });
    };

    const copyAffiliateLink = (product) => {
        const link = `${window.location.origin}/l/${product.slug}/${auth.user.id}`;
        clipboard.copy(link);
        notifications.show({
            title: "Link Disalin",
            message: "Siap disebarkan ke sosmed!",
            color: "blue",
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Katalog Produk" />

            <Stack gap="xl">
                <Box>
                    <Title order={2}>Katalog Produk UMKM</Title>
                    <Text c="dimmed" size="sm">
                        Cari produk, promosikan, dan klaim komisi Anda.
                    </Text>
                </Box>

                <TextInput
                    placeholder="Cari produk..."
                    size="md"
                    leftSection={<IconSearch size={18} />}
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                />

                {/* Grid Responsif: HP: 2, Tablet: 3, PC: 4 */}
                <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="xs">
                    {filteredProducts.map((product) => (
                        <Card
                            key={product.id}
                            shadow="sm"
                            padding="xs"
                            radius="md"
                            withBorder
                        >
                            <Card.Section>
                                <Image
                                    src={`/storage/${product.image}`}
                                    height={{ base: 100, sm: 140, md: 160 }}
                                    alt={product.name}
                                />
                            </Card.Section>

                            <Stack
                                justify="space-between"
                                mt="sm"
                                gap="xs"
                                style={{ flex: 1 }}
                            >
                                <Box>
                                    <Text fw={700} size="sm" lineClamp={1}>
                                        {product.name}
                                    </Text>
                                    <Badge
                                        color="green"
                                        variant="light"
                                        fullWidth
                                        mt={4}
                                        size="xs"
                                    >
                                        Komisi Rp
                                        {product.commission_amount.toLocaleString()}
                                    </Badge>
                                </Box>
                                <Button
                                    variant="filled"
                                    color="blue"
                                    size="xs"
                                    fullWidth
                                    onClick={() => handleOpenDetail(product)}
                                    leftSection={<IconInfoCircle size={14} />}
                                >
                                    Detail & Klaim
                                </Button>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>

                {/* MODAL DETAIL & FORM KLAIM */}
                <Modal
                    opened={opened}
                    onClose={close}
                    title={<Text fw={700}>Bahan Promosi & Klaim</Text>}
                    size="lg"
                    centered
                >
                    {selectedProduct && (
                        <Grid gutter="xl">
                            {/* Sisi Kiri: Video & Media */}
                            <Grid.Col span={{ base: 12, md: 5 }}>
                                <AspectRatio ratio={9 / 16}>
                                    <video
                                        src={`/storage/${selectedProduct.video_url}`}
                                        controls
                                        style={{
                                            borderRadius: "8px",
                                            backgroundColor: "#000",
                                        }}
                                    />
                                </AspectRatio>
                                <Button
                                    fullWidth
                                    mt="sm"
                                    variant="light"
                                    leftSection={<IconDownload size={16} />}
                                    component="a"
                                    href={`/storage/${selectedProduct.video_url}`}
                                    download
                                >
                                    Download Video
                                </Button>
                            </Grid.Col>

                            {/* Sisi Kanan: Detail & Form Klaim */}
                            <Grid.Col span={{ base: 12, md: 7 }}>
                                <Stack>
                                    <Box>
                                        <Text fw={700} size="xl">
                                            {selectedProduct.name}
                                        </Text>
                                        <Text size="sm" c="green" fw={600}>
                                            Potensi Komisi: Rp{" "}
                                            {selectedProduct.commission_amount.toLocaleString()}
                                        </Text>
                                    </Box>

                                    <Button
                                        color={
                                            clipboard.copied ? "teal" : "blue"
                                        }
                                        variant="outline"
                                        leftSection={<IconCopy size={18} />}
                                        onClick={() =>
                                            copyAffiliateLink(selectedProduct)
                                        }
                                        fullWidth
                                    >
                                        {clipboard.copied
                                            ? "Link Tersalin!"
                                            : "Salin Link Affiliate"}
                                    </Button>

                                    <Divider
                                        label="Form Klaim Komisi"
                                        labelPosition="center"
                                        my="sm"
                                    />

                                    <form onSubmit={handleClaimSubmit}>
                                        <Stack gap="xs">
                                            <TextInput
                                                label="ID Pesanan Shopee"
                                                placeholder="Contoh: 240101XXXXX"
                                                required
                                                value={data.shopee_order_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "shopee_order_id",
                                                        e.currentTarget.value,
                                                    )
                                                }
                                                error={errors.shopee_order_id}
                                            />

                                            {/* TAMBAHAN FORM INPUT FILE GAMBAR */}
                                            <FileInput
                                                label="Bukti Transaksi / Screenshot"
                                                placeholder="Upload gambar (.jpg, .png)"
                                                accept="image/png,image/jpeg,image/jpg"
                                                leftSection={
                                                    <IconPhoto size={16} />
                                                }
                                                value={data.proof_image}
                                                onChange={(file) =>
                                                    setData("proof_image", file)
                                                }
                                                error={errors.proof_image}
                                                clearable
                                            />

                                            <Alert
                                                icon={
                                                    <IconAlertCircle
                                                        size={14}
                                                    />
                                                }
                                                color="blue"
                                                variant="light"
                                                py={5}
                                            >
                                                <Text size="10px">
                                                    Input ID Pesanan dan upload
                                                    bukti screenshot jika
                                                    pembeli sudah menyelesaikan
                                                    pembayaran melalui link
                                                    Anda. Max file: 2MB.
                                                </Text>
                                            </Alert>
                                            <Button
                                                type="submit"
                                                color="green"
                                                loading={processing}
                                                fullWidth
                                            >
                                                Klaim Komisi Sekarang
                                            </Button>
                                        </Stack>
                                    </form>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    )}
                </Modal>
            </Stack>
        </AuthenticatedLayout>
    );
}
