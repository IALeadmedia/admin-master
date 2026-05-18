import { Button, Card, Form, Input } from "antd";
import { appSetting } from "../../constants/app-setting/config.const";
import { useAuth } from "../../context/auth-provider";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

type FieldType = {
  username: string;
  password: string;
};

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: FieldType) => {
    try {
      await login(values.username, values.password);
      navigate({
        to: "/app",
      });
    } catch (error) {
      toast.error("Login falhou", {
        description:
          "Por favor, verifique seu email e senha e tente novamente.",
      });
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-[#c5c5c5]">
      <Card className="w-96">
        <div className="flex justify-center items-center">
          <img className="h-10 mb-5 " src={appSetting.logo} alt="Logo" />
        </div>


        <Form
          className="w-full!"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          requiredMark="optional"
        >
          <Form.Item<FieldType>
            label="Email"
            name="username"
            rules={[
              { required: true, message: "Por favor, insira seu email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Senha"
            name="password"
            rules={[
              { required: true, message: "Por favor, insira sua senha!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" className="w-full">
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
