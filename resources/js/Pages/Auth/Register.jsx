import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    TextInput,
    PasswordInput,
    Button,
    Stack,
    Text,
    Anchor,
    Box,
    Grid,
    Title,
    Divider,
    Group,
} from "@mantine/core";
import {
    IconBrandGoogle,
    IconBrandFacebook,
    IconHome,
    IconUserPlus,
} from "@tabler/icons-react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        // Mencegah double scroll pada body
        document.body.style.overflow = "hidden";
        return () => {
            reset("password", "password_confirmation");
            document.body.style.overflow = "auto";
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun Baru" />

            {/* CONTAINER FIX: Mengunci seluruh layar browser */}
            <Box
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: "white",
                }}
            >
                {/* TOMBOL BERANDA */}
                <Box
                    style={{
                        position: "absolute",
                        top: "1.5rem",
                        right: "1.5rem",
                        zIndex: 10000,
                    }}
                >
                    <Button
                        component={Link}
                        href="/"
                        variant="white"
                        color="gray"
                        radius="md"
                        leftSection={<IconHome size={18} />}
                        style={{
                            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                            border: "1px solid #eee",
                        }}
                    >
                        Beranda
                    </Button>
                </Box>

                <Grid gutter={0} style={{ height: "100%" }}>
                    {/* SISI KIRI: FOTO (Hidden on Mobile) */}
                    <Grid.Col
                        span={{ base: 0, md: 6, lg: 7 }}
                        style={{
                            position: "relative",
                            // Foto bertema kolaborasi/mahasiswa kreatif
                            backgroundImage:
                                'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop")',
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            padding: "5%",
                        }}
                    >
                        {/* Overlay */}
                        <Box
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 60%)",
                            }}
                        />

                        <Box style={{ position: "relative", zIndex: 1 }}>
                            {/* Judul Adaptif */}
                            <Title
                                order={1}
                                c="white"
                                fw={900}
                                style={{
                                    fontSize: "clamp(2rem, 5vw, 4rem)",
                                    lineHeight: 1.1,
                                }}
                            >
                                Gabung <br />
                                Sekarang.
                            </Title>
                            <Text
                                c="white"
                                mt="md"
                                style={{
                                    fontSize: "clamp(1rem, 1.2vw, 1.5rem)",
                                    maxWidth: "85%",
                                    fontWeight: 500,
                                }}
                            >
                                Mulai perjalananmu sebagai mitra UMKM atau
                                Affiliator Mahasiswa di Akujualin.
                            </Text>
                        </Box>
                    </Grid.Col>

                    {/* SISI KANAN: FORM REGISTER (Area Scrollable) */}
                    <Grid.Col
                        span={{ base: 12, md: 6, lg: 5 }}
                        style={{
                            height: "100vh",
                            overflowY: "auto",
                            backgroundColor: "white",
                            WebkitOverflowScrolling: "touch",
                        }}
                    >
                        {/* Wrapper Form untuk Centering & Scrolling */}
                        <Box
                            style={{
                                minHeight: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "4rem 1.5rem", // Padding lebih besar agar form panjang tidak terpotong
                            }}
                        >
                            <Box style={{ width: "100%", maxWidth: 420 }}>
                                <Stack gap="xs" mb={35}>
                                    <Title
                                        order={2}
                                        fw={800}
                                        style={{
                                            fontSize: "2.2rem",
                                            letterSpacing: "-1.5px",
                                        }}
                                    >
                                        Daftar Akun
                                    </Title>
                                    <Text c="dimmed" size="md" fw={500}>
                                        Sudah punya akun?{" "}
                                        <Anchor
                                            component={Link}
                                            href={route("login")}
                                            fw={700}
                                        >
                                            Masuk di sini
                                        </Anchor>
                                    </Text>
                                </Stack>

                                <form onSubmit={submit}>
                                    <Stack gap="md">
                                        <TextInput
                                            label="Nama Lengkap"
                                            placeholder="Masukkan nama lengkap Anda"
                                            size="md"
                                            radius="md"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            error={errors.name}
                                            required
                                        />

                                        <TextInput
                                            label="Alamat Email"
                                            placeholder="nama@email.com"
                                            size="md"
                                            radius="md"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            error={errors.email}
                                            required
                                        />

                                        <PasswordInput
                                            label="Password"
                                            placeholder="Minimal 8 karakter"
                                            size="md"
                                            radius="md"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.password}
                                            required
                                        />

                                        <PasswordInput
                                            label="Konfirmasi Password"
                                            placeholder="Ulangi password"
                                            size="md"
                                            radius="md"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.password_confirmation}
                                            required
                                        />

                                        <Button
                                            fullWidth
                                            size="md"
                                            radius="md"
                                            mt="xl"
                                            type="submit"
                                            loading={processing}
                                            color="blue"
                                            leftSection={
                                                <IconUserPlus size={20} />
                                            }
                                            style={{ height: "52px" }}
                                        >
                                            Daftar Sekarang
                                        </Button>

                                        <Divider
                                            label="atau daftar dengan"
                                            labelPosition="center"
                                            my="sm"
                                        />

                                        <Group grow gap="md">
                                            <Button
                                                variant="default"
                                                radius="md"
                                                size="md"
                                                leftSection={
                                                    <IconBrandGoogle
                                                        size={20}
                                                        color="#DB4437"
                                                    />
                                                }
                                            >
                                                Google
                                            </Button>
                                            <Button
                                                variant="default"
                                                radius="md"
                                                size="md"
                                                leftSection={
                                                    <IconBrandFacebook
                                                        size={20}
                                                        color="#1877F2"
                                                    />
                                                }
                                            >
                                                Facebook
                                            </Button>
                                        </Group>

                                        <Text
                                            size="xs"
                                            c="dimmed"
                                            ta="center"
                                            mt={30}
                                            style={{ lineHeight: 1.6 }}
                                        >
                                            Dengan mendaftar, Anda menyetujui{" "}
                                            <Anchor size="xs">
                                                Syarat & Ketentuan
                                            </Anchor>{" "}
                                            serta{" "}
                                            <Anchor size="xs">
                                                Kebijakan Privasi
                                            </Anchor>{" "}
                                            Akujualin.
                                        </Text>
                                    </Stack>
                                </form>
                            </Box>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </GuestLayout>
    );
}
