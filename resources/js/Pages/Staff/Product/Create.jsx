import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    TextInput,
    NumberInput,
    Textarea,
    Button,
    Paper,
    Stack,
    Grid,
    Title,
    Text,
    Group,
    AspectRatio,
    Box,
    Progress,
    ActionIcon,
} from "@mantine/core";
import {
    IconArrowLeft,
    IconPhoto,
    IconVideo,
    IconUpload,
    IconX,
} from "@tabler/icons-react";
import { useState, useRef } from "react";

export default function Create({ auth }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const videoRef = useRef(null);

    const { data, setData, post, processing, errors, progress } = useForm({
        name: "",
        price: "",
        commission_amount: "",
        stock: "",
        description: "",
        product_link: "",
        image: null,
        video_url: null,
        video_brief: "",
    });

    // Handle Image Preview
    const handleImageChange = (file) => {
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle Video Preview
    const handleVideoChange = (file) => {
        if (file) {
            setData("video_url", file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("staff.product.store"), {
            forceFormData: true,
            onSuccess: () => {
                // Opsional: tambah notifikasi sukses
            },
            onError: (errors) => {
                // Ini akan memunculkan error di console F12 jika gagal
                console.log("Validation Errors:", errors);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tambah Produk & Konten" />

            <Stack gap="lg">
                <Group justify="space-between">
                    <Group>
                        <ActionIcon
                            component={Link}
                            href={route("staff.product.index")}
                            variant="subtle"
                        >
                            <IconArrowLeft size={20} />
                        </ActionIcon>
                        <Title order={3}>Tambah Produk Baru</Title>
                    </Group>
                </Group>

                <form onSubmit={submit}>
                    <Grid gutter="xl">
                        {/* SISI KIRI: DATA PRODUK */}
                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <Paper withBorder p="xl" radius="md" shadow="sm">
                                <Stack gap="md">
                                    <TextInput
                                        label="Nama Produk"
                                        placeholder="Contoh: Sepatu Sneakers Aerostreet"
                                        required
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        error={errors.name}
                                    />

                                    <Grid grow>
                                        <Grid.Col span={6}>
                                            <NumberInput
                                                label="Harga Jual (Rp)"
                                                placeholder="150000"
                                                hideControls
                                                required
                                                value={data.price}
                                                onChange={(val) =>
                                                    setData("price", val)
                                                }
                                                error={errors.price}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <NumberInput
                                                label="Komisi Affiliate (Rp)"
                                                placeholder="15000"
                                                hideControls
                                                required
                                                value={data.commission_amount}
                                                onChange={(val) =>
                                                    setData(
                                                        "commission_amount",
                                                        val,
                                                    )
                                                }
                                                error={errors.commission_amount}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <NumberInput
                                                label="Stok"
                                                placeholder="99"
                                                required
                                                value={data.stock}
                                                onChange={(val) =>
                                                    setData("stock", val)
                                                }
                                                error={errors.stock}
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <TextInput
                                        label="Link Produk Shopee/Toko"
                                        placeholder="https://shopee.co.id/..."
                                        value={data.product_link}
                                        onChange={(e) =>
                                            setData(
                                                "product_link",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.product_link}
                                    />

                                    <Textarea
                                        label="Deskripsi Produk"
                                        placeholder="Jelaskan keunggulan produk Anda..."
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                    />

                                    <Divider
                                        label="Bahan Promosi Mahasiswa"
                                        labelPosition="center"
                                        my="sm"
                                    />

                                    <Textarea
                                        label="Brief Video Konten"
                                        placeholder="Instruksi untuk mahasiswa (Contoh: Sebutkan diskon 10% di awal video)"
                                        rows={3}
                                        value={data.video_brief}
                                        onChange={(e) =>
                                            setData(
                                                "video_brief",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Stack>
                            </Paper>
                        </Grid.Col>

                        {/* SISI KANAN: MEDIA PREVIEW */}
                        <Grid.Col span={{ base: 12, md: 5 }}>
                            <Stack gap="md">
                                {/* Upload Gambar */}
                                <Paper withBorder p="md" radius="md">
                                    <Text fw={600} size="sm" mb="xs">
                                        Foto Produk
                                    </Text>
                                    {imagePreview ? (
                                        <Box pos="relative">
                                            <img
                                                src={imagePreview}
                                                style={{
                                                    width: "100%",
                                                    borderRadius: "8px",
                                                    maxHeight: "200px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <ActionIcon
                                                color="red"
                                                pos="absolute"
                                                top={5}
                                                right={5}
                                                onClick={() =>
                                                    setImagePreview(null)
                                                }
                                            >
                                                <IconX size={16} />
                                            </ActionIcon>
                                        </Box>
                                    ) : (
                                        <Box
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "image-input",
                                                    )
                                                    .click()
                                            }
                                            style={{
                                                border: "2px dashed #dee2e6",
                                                borderRadius: "8px",
                                                padding: "30px",
                                                textAlign: "center",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <IconPhoto
                                                size={32}
                                                color="#adb5bd"
                                                stroke={1.5}
                                            />
                                            <Text size="xs" c="dimmed" mt={5}>
                                                Klik untuk upload foto
                                            </Text>
                                        </Box>
                                    )}
                                    <input
                                        id="image-input"
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleImageChange(e.target.files[0])
                                        }
                                    />
                                    {errors.image && (
                                        <Text color="red" size="xs" mt={5}>
                                            {errors.image}
                                        </Text>
                                    )}
                                </Paper>

                                {/* Upload Video */}
                                <Paper withBorder p="md" radius="md">
                                    <Text fw={600} size="sm" mb="xs">
                                        Video Konten (Portrait 9:16)
                                    </Text>
                                    {videoPreview ? (
                                        <Box pos="relative">
                                            <AspectRatio
                                                ratio={9 / 16}
                                                style={{
                                                    maxWidth: "200px",
                                                    margin: "auto",
                                                }}
                                            >
                                                <video
                                                    src={videoPreview}
                                                    controls
                                                    style={{
                                                        borderRadius: "8px",
                                                        backgroundColor:
                                                            "black",
                                                    }}
                                                />
                                            </AspectRatio>
                                            <ActionIcon
                                                color="red"
                                                pos="absolute"
                                                top={5}
                                                right={5}
                                                onClick={() =>
                                                    setVideoPreview(null)
                                                }
                                            >
                                                <IconX size={16} />
                                            </ActionIcon>
                                        </Box>
                                    ) : (
                                        <Box
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "video-input",
                                                    )
                                                    .click()
                                            }
                                            style={{
                                                border: "2px dashed #dee2e6",
                                                borderRadius: "8px",
                                                padding: "30px",
                                                textAlign: "center",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <IconVideo
                                                size={32}
                                                color="#adb5bd"
                                                stroke={1.5}
                                            />
                                            <Text size="xs" c="dimmed" mt={5}>
                                                Klik untuk upload video konten
                                            </Text>
                                        </Box>
                                    )}
                                    <input
                                        id="video-input"
                                        type="file"
                                        hidden
                                        accept="video/*"
                                        onChange={(e) =>
                                            handleVideoChange(e.target.files[0])
                                        }
                                    />
                                    {errors.video_url && (
                                        <Text color="red" size="xs" mt={5}>
                                            {errors.video_url}
                                        </Text>
                                    )}
                                </Paper>

                                {progress && (
                                    <Paper withBorder p="md" radius="md">
                                        <Text size="xs" mb={5} fw={700}>
                                            Mengunggah: {progress.percentage}%
                                        </Text>
                                        <Progress
                                            value={progress.percentage}
                                            animated
                                            color="blue"
                                        />
                                    </Paper>
                                )}

                                <Button
                                    size="lg"
                                    fullWidth
                                    type="submit"
                                    loading={processing}
                                    leftSection={<IconUpload size={20} />}
                                >
                                    Simpan Produk & Video
                                </Button>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </form>
            </Stack>
        </AuthenticatedLayout>
    );
}

const Divider = ({ label }) => (
    <Box style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
        <Box style={{ flex: 1, height: "1px", backgroundColor: "#e9ecef" }} />
        <Text size="xs" c="dimmed" px="sm" tt="uppercase" fw={700}>
            {label}
        </Text>
        <Box style={{ flex: 1, height: "1px", backgroundColor: "#e9ecef" }} />
    </Box>
);
