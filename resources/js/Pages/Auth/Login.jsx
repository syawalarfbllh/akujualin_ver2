import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Group,
    Anchor,
    Stack,
    Text,
    Grid,
    Box,
    Title,
    Divider,
} from "@mantine/core";
import {
    IconBrandGoogle,
    IconBrandFacebook,
    IconHome,
    IconLogin,
} from "@tabler/icons-react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        // Hapus scroll pada body agar tidak double scroll
        document.body.style.overflow = "hidden";
        return () => {
            reset("password");
            document.body.style.overflow = "auto";
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Masuk ke Akun" />

            {/* CONTAINER FIX: Mengunci seluruh layar browser */}
            <Box
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: "white",
                }}
            >
                {/* TOMBOL BERANDA: Pojok Kanan Atas */}
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
                    {/* SISI KIRI: FOTO (Hanya muncul di Desktop md: 768px ke atas) */}
                    <Grid.Col
                        span={{ base: 0, md: 6, lg: 7 }}
                        style={{
                            position: "relative",
                            backgroundImage:
                                'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop")',
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            padding: "5%", // Padding menggunakan % agar responsif
                        }}
                    >
                        {/* Overlay */}
                        <Box
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
                            }}
                        />

                        <Box style={{ position: "relative", zIndex: 1 }}>
                            {/* Judul dengan Ukuran Font Adaptif (Viewport Width) */}
                            <Title
                                order={1}
                                c="white"
                                fw={900}
                                style={{
                                    fontSize: "clamp(2rem, 5vw, 4rem)",
                                    lineHeight: 1.1,
                                }}
                            >
                                Akujualin.
                            </Title>
                            <Text
                                c="white"
                                mt="md"
                                style={{
                                    fontSize: "clamp(1rem, 1.2vw, 1.5rem)",
                                    maxWidth: "80%",
                                    fontWeight: 500,
                                }}
                            >
                                Platform penghubung UMKM dan Mahasiswa terbaik
                                untuk kolaborasi bisnis digital.
                            </Text>
                        </Box>
                    </Grid.Col>

                    {/* SISI KANAN: FORM LOGIN (Area Scroll yang Pasti Berhasil) */}
                    <Grid.Col
                        span={{ base: 12, md: 6, lg: 5 }}
                        style={{
                            height: "100vh",
                            overflowY: "auto", // INI MENGAKTIFKAN SCROLL
                            backgroundColor: "white",
                            WebkitOverflowScrolling: "touch", // Scroll halus di iOS
                        }}
                    >
                        {/* Wrapper Form: Menggunakan Flex untuk centering tapi membolehkan scroll */}
                        <Box
                            style={{
                                minHeight: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "3rem 1.5rem",
                            }}
                        >
                            <Box style={{ width: "100%", maxWidth: 400 }}>
                                <Stack gap="xs" mb={40}>
                                    <Title
                                        order={2}
                                        fw={800}
                                        style={{
                                            fontSize: "2.2rem",
                                            letterSpacing: "-1.5px",
                                        }}
                                    >
                                        Login
                                    </Title>
                                    <Text c="dimmed" size="md" fw={500}>
                                        Belum punya akun?{" "}
                                        <Anchor
                                            component={Link}
                                            href={route("register")}
                                            fw={700}
                                        >
                                            Daftar sekarang
                                        </Anchor>
                                    </Text>
                                </Stack>

                                {status && (
                                    <Text
                                        color="green"
                                        size="sm"
                                        mb="md"
                                        fw={500}
                                    >
                                        {status}
                                    </Text>
                                )}

                                <form onSubmit={submit}>
                                    <Stack gap="xl">
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

                                        <Box>
                                            <PasswordInput
                                                label="Password"
                                                placeholder="Masukkan password"
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
                                            <Group
                                                justify="space-between"
                                                mt="md"
                                            >
                                                <Checkbox
                                                    label="Ingat saya"
                                                    checked={data.remember}
                                                    onChange={(e) =>
                                                        setData(
                                                            "remember",
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                                {canResetPassword && (
                                                    <Anchor
                                                        component={Link}
                                                        href={route(
                                                            "password.request",
                                                        )}
                                                        size="sm"
                                                        fw={600}
                                                    >
                                                        Lupa Password?
                                                    </Anchor>
                                                )}
                                            </Group>
                                        </Box>

                                        <Button
                                            fullWidth
                                            size="md"
                                            radius="md"
                                            type="submit"
                                            loading={processing}
                                            color="blue"
                                            leftSection={
                                                <IconLogin size={20} />
                                            }
                                            style={{ height: "52px" }}
                                        >
                                            Masuk
                                        </Button>

                                        <Divider
                                            label="atau masuk dengan"
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
                                            mt={40}
                                        >
                                            &copy; 2026 Akujualin Platform.{" "}
                                            <br /> Semua hak dilindungi
                                            undang-undang.
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
