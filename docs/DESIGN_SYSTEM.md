# Sistema de Design Conecta
## Documentação Técnica v1.0

> 📖 **Projeto**: Este Design System foi criado para o **Conecta Obras**, uma plataforma de mapeamento de obras para geração de leads.
> Consulte [01_PROJECT_MEMORY.md](./01_PROJECT_MEMORY.md) para contexto completo do projeto.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Princípios e Objetivos](#princípios-e-objetivos)
3. [Arquitetura](#arquitetura)
4. [Fundamentos](#fundamentos)
5. [Componentes](#componentes)
6. [Padrões de Implementação](#padrões-de-implementação)
7. [Acessibilidade](#acessibilidade)
8. [Guia de Uso](#guia-de-uso)
9. [Manutenção](#manutenção)

---

## 1. Visão Geral

O **Sistema de Design Conecta** é um framework completo de componentes React construído sobre Next.js 15, Radix UI e Tailwind CSS v4, projetado para criar interfaces consistentes, acessíveis e escaláveis.

### 1.1 Stack Tecnológica

- **Framework**: Next.js 15.5.9
- **Runtime**: React 19.0.0
- **UI Primitives**: Radix UI (27 primitivos instalados)
- **Styling**: Tailwind CSS v4.1.18
- **TypeScript**: v5
- **Animações**: tailwindcss-animate
- **Formulários**: React Hook Form 7.71 + Zod 4.3
- **Ícones**: Lucide React 0.562

### 1.2 Características Principais

- ✅ 58+ componentes prontos para produção
- ✅ Totalmente acessível (WCAG 2.1 AA)
- ✅ Suporte completo a temas (claro/escuro)
- ✅ Type-safe com TypeScript
- ✅ Variantes controladas por CVA (Class Variance Authority)
- ✅ Sistema de tokens de design semântico
- ✅ Responsivo por padrão

---

## 2. Princípios e Objetivos

### 2.1 Princípios de Design

#### **Consistência**
Todos os componentes seguem padrões visuais e comportamentais unificados, garantindo experiências previsíveis em toda a aplicação.

#### **Acessibilidade**
Implementação nativa de ARIA patterns, navegação por teclado e suporte a leitores de tela em todos os componentes.

#### **Composabilidade**
Componentes projetados para serem compostos e combinados de forma flexível, sem acoplamento rígido.

#### **Performance**
Otimização para renderização, com componentes client-side apenas quando necessário e suporte a Server Components do Next.js.

#### **Manutenibilidade**
Código limpo, documentado e seguindo convenções consistentes para facilitar manutenção e evolução.

### 2.2 Objetivos

1. **Acelerar o desenvolvimento**: Reduzir tempo de implementação de interfaces em 60%
2. **Garantir qualidade**: Zero bugs de acessibilidade e inconsistências visuais
3. **Escalar com eficiência**: Suportar crescimento de produto sem degradação
4. **Facilitar colaboração**: Linguagem comum entre design e desenvolvimento

---

## 3. Arquitetura

### 3.1 Estrutura de Diretórios

```
conectaObras/
├── docs/                     # Documentação do projeto
├── public/                  # Assets estáticos
├── src/
│   ├── app/
│   │   ├── globals.css      # Tokens de design e configuração Tailwind
│   │   └── layout.tsx        # Layout raiz com fontes
│   ├── components/
│   │   ├── ui/               # 58 componentes shadcn/ui
│   │   ├── compartilhados/   # Componentes globais customizados
│   │   └── layouts/          # Layouts reutilizáveis
│   ├── features/            # Módulos por domínio (obras, clientes, etc)
│   ├── hooks/               # Hooks globais
│   ├── lib/                 # Configurações (supabase, utils)
│   ├── types/               # Types globais
│   └── utils/               # Funções utilitárias
└── supabase/                # Migrations e Edge Functions
```

> 📖 Consulte [22_estrutura_projeto.md](./20_ARCH/22_estrutura_projeto.md) para estrutura detalhada.

### 3.2 Camadas do Sistema

```
┌─────────────────────────────────────────┐
│   Componentes de Aplicação              │ ← Uso pelos desenvolvedores
├─────────────────────────────────────────┤
│   Componentes UI (Sistema de Design)    │ ← Biblioteca de componentes
├─────────────────────────────────────────┤
│   Primitivos Radix UI                   │ ← Comportamento e acessibilidade
├─────────────────────────────────────────┤
│   Tokens de Design (CSS Variables)      │ ← Fundamentos visuais
├─────────────────────────────────────────┤
│   Tailwind CSS v4                       │ ← Engine de styling
└─────────────────────────────────────────┘
```

---

## 4. Fundamentos

### 4.1 Sistema de Cores

#### **Paleta Semântica**

O sistema utiliza cores semânticas baseadas em OKLCH para garantir consistência perceptual:

```css
/* Light Mode */
--primary: #2B4A9D                    /* Azul institucional */
--brand-red: #E63946                  /* Vermelho institucional */
--primary-foreground: oklch(0.985 0 0) /* Branco quase puro */
--secondary: oklch(0.97 0 0)           /* Cinza muito claro */
--destructive: oklch(0.577 0.245 27.325) /* Vermelho de alerta */
--muted: oklch(0.97 0 0)               /* Cinza neutro */
--accent: oklch(0.97 0 0)              /* Cinza de destaque */

/* Dark Mode */
--primary: #e0e0e0                    /* Cinza claro */
--destructive: oklch(0.704 0.191 22.216) /* Vermelho mais claro */
```

#### **Cores de Gráficos**

5 cores pré-configuradas para visualizações de dados:

```css
--chart-1 a --chart-5: /* Paleta otimizada para acessibilidade */
```

#### **Uso de Cores**

```tsx
// Classes Tailwind geradas automaticamente
<Button className="bg-primary text-primary-foreground" />
<Card className="bg-card text-card-foreground" />
<Alert className="bg-destructive text-destructive-foreground" />
```

### 4.2 Tipografia

#### **Fontes**

- **Sans-serif**: Geist (corpo e interface)
- **Monospace**: Geist Mono (código e dados técnicos)
- **Serif**: Source Serif 4 (conteúdo editorial)

#### **Configuração**

```tsx
// app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
```

#### **Classes de Aplicação**

```tsx
<body className="font-sans">       {/* Geist */}
<code className="font-mono">       {/* Geist Mono */}
<article className="font-serif">  {/* Source Serif 4 */}
```

#### **Escalas de Tamanho**

| Classe | Tamanho | Uso Recomendado |
|--------|---------|-----------------|
| `text-xs` | 12px | Labels, badges |
| `text-sm` | 14px | Corpo secundário, descrições |
| `text-base` | 16px | Corpo principal |
| `text-lg` | 18px | Títulos de seção |
| `text-xl` | 20px | Títulos principais |
| `text-2xl` | 24px | Headlines |

### 4.3 Espaçamento e Border Radius

Sistema baseado em escala de 4px com bordas levemente arredondadas:

```css
/* Base: --radius: 0.5rem (8px) */
--radius-sm: calc(var(--radius) - 4px)  /* 4px */
--radius-md: calc(var(--radius) - 2px)  /* 6px */
--radius-lg: var(--radius)               /* 8px */
--radius-xl: calc(var(--radius) + 4px)  /* 12px */
```

**Border Radius**: Moderado (0.5rem base) para estética amigável e moderna.

> **Configuração em globals.css:**
> ```css
> :root {
>   --radius: 0.5rem;
> }
> ```

### 4.4 Sombras

Sistema customizável via variáveis CSS:

```css
--shadow-x: 0px
--shadow-y: 0px (light) / 1px (dark)
--shadow-blur: 2px
--shadow-spread: 0px
--shadow-opacity: 0.05
--shadow-color: #000000
```

Escalas disponíveis: `shadow-2xs`, `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`

### 4.5 Breakpoints

```css
sm:  640px   /* Tablets */
md:  768px   /* Desktop small */
lg:  1024px  /* Desktop */
xl:  1280px  /* Desktop large */
2xl: 1536px  /* Ultra-wide */
```

### 4.6 Convenções de Nomenclatura (Clean Code pt-BR)

O projeto utiliza nomenclaturas em português seguindo padrões Clean Code:

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| **Componentes** | PascalCase, tipo+nome | `FormularioCliente`, `TabelaObras` |
| **Hooks** | use + ação | `useCriarObra`, `useObras` |
| **Booleanos** | prefixo descritivo | `estaCarregando`, `temErro`, `podeEditar` |
| **Funções** | verbo + contexto | `calcularTotal()`, `formatarData()` |
| **Arquivos** | kebab-case | `formulario-cliente.tsx` |

> 📖 Consulte [21_convencoes_nomenclatura.md](./20_ARCH/21_convencoes_nomenclatura.md) para guia completo.

---

## 5. Componentes

### 5.1 Componentes de Entrada

#### **Button**

**Variantes**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`  
**Tamanhos**: `default`, `sm`, `lg`, `icon`, `icon-sm`, `icon-lg`

```tsx
import { Button } from '@/components/ui/button'

// Variantes
<Button variant="default">Salvar</Button>
<Button variant="destructive">Excluir</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="ghost">Menu</Button>

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="default">Padrão</Button>
<Button size="lg">Grande</Button>
<Button size="icon"><Icon /></Button>

// Com ícones
<Button>
  <SaveIcon />
  Salvar
</Button>

// Como outro elemento (asChild)
<Button asChild>
  <a href="/docs">Documentação</a>
</Button>
```

**Estados**:
- `:hover` - Escurecimento de 10%
- `:focus-visible` - Ring de 3px com cor `ring`
- `:disabled` - Opacidade 50%, sem interação
- `aria-invalid` - Ring vermelha para erros

**Acessibilidade**:
- ✅ Navegação por Tab
- ✅ Ativação por Space/Enter
- ✅ Focus visível
- ✅ Estados ARIA

#### **Input**

Campo de entrada de texto com suporte a validação e estados.

```tsx
import { Input } from '@/components/ui/input'

// Básico
<Input type="text" placeholder="Digite seu nome" />

// Com validação
<Input 
  type="email" 
  aria-invalid={hasError}
  aria-describedby="error-message"
/>

// Tipos suportados
<Input type="password" />
<Input type="number" />
<Input type="date" />
<Input type="file" />
```

**Características**:
- Altura padrão: `h-9` (36px)
- Shadow sutil: `shadow-xs`
- Focus ring: 2px (reduzido para visual mais sutil)
- Suporte a file upload com estilização
- Background transparente adaptável a temas

#### **Textarea**

Similar ao Input, mas para conteúdo multilinha.

```tsx
import { Textarea } from '@/components/ui/textarea'

<Textarea 
  placeholder="Digite sua mensagem..."
  rows={4}
/>
```

#### **Select**

Dropdown nativo com estilização customizada.

```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Selecione..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opção 1</SelectItem>
    <SelectItem value="option2">Opção 2</SelectItem>
    <SelectItem value="option3" disabled>Opção 3</SelectItem>
  </SelectContent>
</Select>

// Com grupos
<SelectContent>
  <SelectLabel>Categoria A</SelectLabel>
  <SelectItem value="a1">Item A1</SelectItem>
  <SelectSeparator />
  <SelectLabel>Categoria B</SelectLabel>
  <SelectItem value="b1">Item B1</SelectItem>
</SelectContent>
```

**Tamanhos**: `default` (h-9), `sm` (h-8)

#### **Checkbox**

```tsx
import { Checkbox } from '@/components/ui/checkbox'

<Checkbox id="terms" />
<label htmlFor="terms">Aceito os termos</label>

// Com estado indeterminado
<Checkbox checked="indeterminate" />
```

#### **Radio Group**

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

<RadioGroup defaultValue="option1">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option1" id="r1" />
    <Label htmlFor="r1">Opção 1</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option2" id="r2" />
    <Label htmlFor="r2">Opção 2</Label>
  </div>
</RadioGroup>
```

#### **Switch**

```tsx
import { Switch } from '@/components/ui/switch'

<Switch id="notifications" />
<label htmlFor="notifications">Notificações</label>
```

#### **Slider**

```tsx
import { Slider } from '@/components/ui/slider'

<Slider 
  defaultValue={[50]} 
  max={100} 
  step={1} 
/>

// Range slider
<Slider defaultValue={[25, 75]} max={100} step={1} />
```

### 5.2 Formulários

#### **Form (com React Hook Form)**

Sistema completo de formulários com validação integrada.

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const formSchema = z.object({
  username: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                Este será seu nome público
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  )
}
```

**Componentes**:
- `Form`: Provider do React Hook Form
- `FormField`: Wrapper de campo com Controller
- `FormItem`: Container de campo (grid com gap-2)
- `FormLabel`: Label com estado de erro
- `FormControl`: Wrapper que injeta props de acessibilidade
- `FormDescription`: Texto de ajuda
- `FormMessage`: Mensagem de erro automática

#### **Input Group**

Agrupa inputs com addons visuais.

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea
} from '@/components/ui/input-group'

<InputGroup>
  <span>https://</span>
  <Input placeholder="site.com" />
</InputGroup>
```

#### **Field**

Campo de formulário completo.

```tsx
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle
} from '@/components/ui/field'

<Field
  label="Email"
  description="Seu email de contato"
  error="Email inválido"
>
  <Input type="email" />
</Field>
```

### 5.3 Componentes de Layout

#### **Card**

Container para agrupamento de conteúdo.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon"><MoreIcon /></Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <p>Conteúdo principal do card</p>
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

**Estrutura**:
- Padding: `py-6` vertical, `px-6` nos sub-componentes
- Gap interno: `gap-6`
- Border radius: `rounded-xl`
- Shadow: `shadow-sm`

#### **Separator**

Linha divisória horizontal ou vertical.

```tsx
import { Separator } from '@/components/ui/separator'

<Separator />
<Separator orientation="vertical" />
```

#### **Aspect Ratio**

Mantém proporção de elemento.

```tsx
import { AspectRatio } from '@/components/ui/aspect-ratio'

<AspectRatio ratio={16 / 9}>
  <img src="/image.jpg" alt="Imagem" />
</AspectRatio>
```

#### **Resizable**

Painéis redimensionáveis.

```tsx
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={25}>
    Sidebar
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>
    Conteúdo principal
  </ResizablePanel>
</ResizablePanelGroup>
```

#### **Scroll Area**

Área com scroll customizado.

```tsx
import { ScrollArea } from '@/components/ui/scroll-area'

<ScrollArea className="h-[200px]">
  <div className="p-4">
    {/* Conteúdo longo */}
  </div>
</ScrollArea>
```

### 5.4 Navegação

#### **Navigation Menu**

Menu de navegação com dropdowns.

```tsx
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Produtos</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/produto1">
          Produto 1
        </NavigationMenuLink>
        <NavigationMenuLink href="/produto2">
          Produto 2
        </NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

#### **Menubar**

Barra de menu desktop-style.

```tsx
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/components/ui/menubar'

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>Arquivo</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Novo</MenubarItem>
      <MenubarItem>Abrir</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

#### **Breadcrumb**

Navegação hierárquica.

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/produtos">Produtos</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Detalhes</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

#### **Pagination**

Controles de paginação.

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

#### **Tabs**

Sistema de abas.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Aba 1</TabsTrigger>
    <TabsTrigger value="tab2">Aba 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    Conteúdo da aba 1
  </TabsContent>
  <TabsContent value="tab2">
    Conteúdo da aba 2
  </TabsContent>
</Tabs>
```

#### **Sidebar**

Sistema de navegação lateral colapsável com suporte a ícones.

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar'

// Uso básico
<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>...</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={true} tooltip="Dashboard">
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>...</SidebarFooter>
    <SidebarRail />
  </Sidebar>
  <SidebarInset>
    {/* Conteúdo principal */}
  </SidebarInset>
</SidebarProvider>
```

**Características**:
- Fonte: `text-base` (16px) para melhor legibilidade
- Altura do item: `h-9` (36px)
- Collapsible modes: `icon`, `offcanvas`, `none`
- Atalho: `Cmd+B` / `Ctrl+B` para toggle
- Estado persistido via cookies
- Tooltips automáticos quando colapsado
- Variantes de tamanho: `default` (h-9), `sm` (h-7), `lg` (h-12)


### 5.5 Overlays

#### **Dialog**

Modal de diálogo.

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Dialog</DialogTitle>
      <DialogDescription>
        Descrição do que este dialog faz
      </DialogDescription>
    </DialogHeader>
    <div>Conteúdo principal</div>
    <DialogFooter>
      <Button>Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Características**:
- Backdrop escuro (50% opacity)
- Animações de entrada/saída
- Botão fechar opcional via `showCloseButton={false}`
- Trap de foco automático
- Fecha com ESC

#### **Alert Dialog**

Dialog para confirmações críticas.

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Excluir</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
      <AlertDialogDescription>
        Esta ação não pode ser desfeita.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction>Continuar</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### **Sheet**

Painel lateral deslizante.

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger asChild>
    <Button>Abrir Menu</Button>
  </SheetTrigger>
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
      <SheetDescription>
        Navegação lateral
      </SheetDescription>
    </SheetHeader>
    <div>Conteúdo do menu</div>
  </SheetContent>
</Sheet>
```

**Sides**: `top`, `right`, `bottom`, `left`

#### **Drawer**

Drawer mobile-first (usando Vaul).

```tsx
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

<Drawer>
  <DrawerTrigger asChild>
    <Button>Abrir</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Título</DrawerTitle>
      <DrawerDescription>Descrição</DrawerDescription>
    </DrawerHeader>
    <div className="p-4">Conteúdo</div>
  </DrawerContent>
</Drawer>
```

#### **Popover**

Overlay posicionado relativo a elemento.

```tsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Abrir</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Conteúdo do popover</p>
  </PopoverContent>
</Popover>
```

#### **Tooltip**

Dica de contexto ao hover.

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Dica útil</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

#### **Hover Card**

Card de prévia ao hover.

```tsx
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">@username</Button>
  </HoverCardTrigger>
  <HoverCardContent>
    <div>Informações do usuário</div>
  </HoverCardContent>
</HoverCard>
```

#### **Context Menu**

Menu de contexto (clique direito).

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

<ContextMenu>
  <ContextMenuTrigger>
    Clique com botão direito
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Copiar</ContextMenuItem>
    <ContextMenuItem>Colar</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

#### **Dropdown Menu**

Menu dropdown com múltiplas opções.

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Perfil</DropdownMenuItem>
    <DropdownMenuItem>Configurações</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 5.6 Feedback

#### **Toast**

Notificação temporária.

```tsx
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

function MyComponent() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Sucesso!",
          description: "Operação realizada com sucesso.",
        })
      }}
    >
      Mostrar Toast
    </Button>
  )
}

// No layout raiz, adicione:
import { Toaster } from '@/components/ui/toaster'

<body>
  {children}
  <Toaster />
</body>
```

**Variantes**: `default`, `destructive`

**Uso avançado**:
```tsx
toast({
  variant: "destructive",
  title: "Erro!",
  description: "Algo deu errado.",
  action: <ToastAction altText="Tentar novamente">Retry</ToastAction>,
})
```

#### **Sonner**

Sistema alternativo de toasts (mais moderno).

```tsx
import { toast } from 'sonner'

toast.success('Operação concluída')
toast.error('Erro ao processar')
toast.info('Informação')
toast.warning('Atenção')

// Com descrição
toast('Evento criado', {
  description: 'Segunda, 2 de Janeiro às 14:30'
})
```

#### **Alert**

Alertas inline.

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

<Alert>
  <AlertTitle>Atenção</AlertTitle>
  <AlertDescription>
    Esta é uma mensagem importante.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertCircle className="size-4" />
  <AlertTitle>Erro</AlertTitle>
  <AlertDescription>
    Ocorreu um erro ao processar.
  </AlertDescription>
</Alert>
```

**Variantes**: `default`, `destructive`

#### **Progress**

Barra de progresso.

```tsx
import { Progress } from '@/components/ui/progress'

<Progress value={33} />
```

#### **Skeleton**

Loading placeholder.

```tsx
import { Skeleton } from '@/components/ui/skeleton'

<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
</div>
```

#### **Spinner**

Indicador de carregamento.

```tsx
import { Spinner } from '@/components/ui/spinner'

<Spinner />
<Spinner size="large" />
```

### 5.7 Visualização de Dados

#### **Table**

Tabela de dados.

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

<Table>
  <TableCaption>Lista de usuários</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>João Silva</TableCell>
      <TableCell>joao@example.com</TableCell>
      <TableCell>Ativo</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### **Chart**

Gráficos baseados em Recharts.

```tsx
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis } from 'recharts'

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
]

<ChartContainer
  config={{
    value: {
      label: "Valor",
      color: "hsl(var(--chart-1))",
    },
  }}
  className="h-[300px]"
>
  <BarChart data={data}>
    <XAxis dataKey="name" />
    <YAxis />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="value" fill="var(--color-value)" />
  </BarChart>
</ChartContainer>
```

#### **Badge**

Etiquetas e tags.

```tsx
import { Badge } from '@/components/ui/badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

#### **Avatar**

Foto de perfil com fallback.

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="João" />
  <AvatarFallback>JS</AvatarFallback>
</Avatar>
```

### 5.8 Componentes Especiais

#### **Command**

Paleta de comandos (⌘K style).

```tsx
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

function CommandMenu() {
  const [open, setOpen] = React.useState(false)

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <CommandItem>Dashboard</CommandItem>
          <CommandItem>Configurações</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

#### **Calendar**

Seletor de datas.

```tsx
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'

function MyComponent() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}
```

**Modos**: `single`, `multiple`, `range`

#### **Carousel**

Carrossel de conteúdo (Embla Carousel).

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

<Carousel>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
    <CarouselItem>Slide 3</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

#### **Accordion**

Painéis expansíveis.

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Pergunta 1?</AccordionTrigger>
    <AccordionContent>
      Resposta da pergunta 1.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Pergunta 2?</AccordionTrigger>
    <AccordionContent>
      Resposta da pergunta 2.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

**Types**: `single`, `multiple`

#### **Collapsible**

Seção colapsável simples.

```tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

<Collapsible>
  <CollapsibleTrigger>Mostrar mais</CollapsibleTrigger>
  <CollapsibleContent>
    Conteúdo adicional aqui
  </CollapsibleContent>
</Collapsible>
```

#### **Sidebar**

Sistema completo de sidebar.

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar'

<Sidebar>
  <SidebarHeader>Logo</SidebarHeader>
  <SidebarContent>
    <SidebarGroup>Navegação</SidebarGroup>
  </SidebarContent>
  <SidebarFooter>Rodapé</SidebarFooter>
</Sidebar>
```

#### **Empty**

Estado vazio.

```tsx
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia
} from '@/components/ui/empty'

<Empty>
  <p>Nenhum item encontrado</p>
</Empty>
```

#### **Kbd**

Teclas de atalho.

```tsx
import {
  Kbd,
  KbdGroup
} from '@/components/ui/kbd'

<Kbd>⌘</Kbd> + <Kbd>K</Kbd>
```

---

## 6. Padrões de Implementação

### 6.1 Utility cn()

**Função de merge de classes Tailwind**

```tsx
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Uso**:
```tsx
// Combina classes condicionalmente
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)} />

// Sobrescreve classes Tailwind corretamente
cn("px-2 py-1", "px-4") // → "py-1 px-4"
```

### 6.2 Class Variance Authority (CVA)

**Criando variantes de componente**

```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  "base-classes", // Classes base
  {
    variants: {
      variant: {
        default: "variant-classes",
        outline: "outline-classes",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Uso
type ButtonProps = VariantProps<typeof buttonVariants>

function Button({ variant, size, className }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} />
  )
}
```

### 6.3 Composição com Radix UI Slot

**Pattern para componentes polimórficos**

```tsx
import { Slot } from '@radix-ui/react-slot'

function Button({ asChild, ...props }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp {...props} />
}

// Permite usar Button como wrapper
<Button asChild>
  <a href="/docs">Link estilizado como botão</a>
</Button>
```

### 6.4 Atributo data-slot

Todos os componentes usam `data-slot` para identificação:

```tsx
<button data-slot="button" />
<div data-slot="card-header" />
```

**Uso**: Facilita seleção em testes e debugging, além de permitir estilos específicos via CSS.

### 6.5 Padrão Server/Client Components

```tsx
// ✅ Server Component (padrão)
export default function Page() {
  return <Card>...</Card>
}

// ⚠️ Client Component (quando necessário)
'use client'

export function InteractiveComponent() {
  const [state, setState] = useState()
  return <Button onClick={() => setState(...)} />
}
```

**Quando usar 'use client'**:
- useState, useEffect, hooks do React
- Event handlers (onClick, onChange, etc.)
- Browser APIs (localStorage, etc.)
- Context consumers

### 6.6 Padrão de Props

```tsx
// Estende props HTML nativas
type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'default' | 'outline'
}

// Estende props de componente Radix
type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>
```

### 6.7 Padrão de Estados

**Estados visuais consistentes em todos os componentes:**

```tsx
// Focus
focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none

// Hover
hover:bg-accent hover:text-accent-foreground

// Disabled
disabled:pointer-events-none disabled:opacity-50

// Invalid (erro)
aria-invalid:ring-destructive/20 aria-invalid:border-destructive

// Active/Selected
data-[state=active]:bg-accent data-[state=active]:text-accent-foreground
```

---

## 7. Acessibilidade

### 7.1 Princípios WCAG 2.1 AA

O sistema segue rigorosamente:

- ✅ **Perceptível**: Contraste mínimo 4.5:1 para texto
- ✅ **Operável**: Navegação completa por teclado
- ✅ **Compreensível**: Labels e instruções claras
- ✅ **Robusto**: Compatível com tecnologias assistivas

### 7.2 Navegação por Teclado

#### **Atalhos Universais**

| Tecla | Ação |
|-------|------|
| `Tab` | Avançar foco |
| `Shift + Tab` | Retroceder foco |
| `Enter` / `Space` | Ativar elemento focado |
| `Esc` | Fechar overlay/dialog |
| `Arrow Keys` | Navegação em listas/menus |

#### **Componentes com Navegação Avançada**

- **Select/Dropdown**: Setas para navegar, Enter para selecionar
- **RadioGroup**: Setas navegam entre opções
- **Tabs**: Setas navegam entre abas
- **Dialog**: Trap de foco (não sai do dialog)
- **Command Palette**: Type-ahead filtering

### 7.3 ARIA Patterns

Todos os componentes implementam ARIA patterns corretas:

```tsx
// Button
<button aria-pressed={isPressed} aria-label="Fechar">

// Input com erro
<input aria-invalid="true" aria-describedby="error-id" />
<span id="error-id" role="alert">Erro...</span>

// Dialog
<div role="dialog" aria-labelledby="title" aria-describedby="desc">
  <h2 id="title">Título</h2>
  <p id="desc">Descrição</p>
</div>

// Select
<select aria-label="Selecione opção" aria-required="true">
```

### 7.4 Focus Management

**Indicador de foco visível** em todos os elementos interativos:

```css
focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1
```

**Ring de 3px** com cor semântica `ring` garante visibilidade em todos os temas.

### 7.5 Contraste de Cores

**Garantia de contraste adequado**:

- Texto normal: ≥ 4.5:1
- Texto grande (≥18px): ≥ 3:1
- Elementos de UI: ≥ 3:1

**Cores de erro** (`destructive`) têm contraste aumentado no modo escuro.

### 7.6 Texto Alternativo

```tsx
// Imagens decorativas
<img src="..." alt="" /> // alt vazio = decorativa

// Imagens informativas
<img src="avatar.jpg" alt="Foto de João Silva" />

// Ícones em botões
<Button>
  <TrashIcon aria-hidden="true" />
  <span className="sr-only">Excluir item</span>
</Button>
```

### 7.7 Screen Reader Only Content

```tsx
// Classe sr-only para conteúdo visível apenas a leitores de tela
<span className="sr-only">Carregando...</span>
<Spinner aria-hidden="true" />
```

### 7.8 Checklist de Acessibilidade

Ao criar novos componentes, verifique:

- [ ] Navegação por teclado funcional
- [ ] Focus visível e lógico
- [ ] Labels semânticos (aria-label, aria-labelledby)
- [ ] Estados comunicados (aria-checked, aria-expanded)
- [ ] Erros anunciados (role="alert", aria-invalid)
- [ ] Contraste de cores adequado
- [ ] Texto alternativo em imagens
- [ ] Trap de foco em modals/dialogs
- [ ] Live regions para updates dinâmicos (aria-live)

---

## 8. Guia de Uso

### 8.1 Instalação e Setup

```bash
# Clonar componentes via shadcn CLI
npx shadcn@latest init

# Adicionar componente específico
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
```

### 8.2 Importação

```tsx
// Importar componentes
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

// Importar hooks
import { useToast } from '@/hooks/use-toast'

// Importar utilitários
import { cn } from '@/lib/utils'
```

### 8.3 Customização

#### **Sobrescrever Estilos**

```tsx
// Via prop className
<Button className="bg-blue-600 hover:bg-blue-700">
  Customizado
</Button>

// Via cn() para merge inteligente
<Card className={cn(
  "border-2",
  isHighlighted && "border-primary"
)}>
```

#### **Modificar Tokens de Design**

```css
/* app/globals.css */
:root {
  --primary: #custom-color;
  --radius: 0.5rem; /* Aumentar border radius */
}
```

#### **Criar Variante Customizada**

```tsx
// Copiar componente para /components/ui/
// Modificar buttonVariants:

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        // ... variantes existentes
        custom: "bg-gradient-to-r from-purple-500 to-pink-500",
      },
    },
  }
)
```

### 8.4 Composição de Componentes

```tsx
// Compor Card com Form
<Card>
  <CardHeader>
    <CardTitle>Formulário de Contato</CardTitle>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <FormField name="email" />
      <FormField name="message" />
    </Form>
  </CardContent>
  <CardFooter>
    <Button type="submit">Enviar</Button>
  </CardFooter>
</Card>
```

### 8.5 Patterns Comuns

#### **Lista de Cards**

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => (
    <Card key={item.id}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>{item.description}</CardContent>
    </Card>
  ))}
</div>
```

#### **Formulário com Validação**

```tsx
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await login(data)
      toast({ title: "Login realizado!" })
    } catch (error) {
      toast({ 
        variant: "destructive",
        title: "Erro no login" 
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField name="email" />
        <FormField name="password" />
        <Button type="submit">Entrar</Button>
      </form>
    </Form>
  )
}
```

#### **Confirmação de Ação**

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Excluir</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
      <AlertDialogDescription>
        Esta ação não pode ser desfeita.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Confirmar
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### **Loading State**

```tsx
function DataTable() {
  const { data, isLoading } = useFetch('/api/data')

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return <Table data={data} />
}
```

### 8.6 Temas (Claro/Escuro)

```tsx
// Usar next-themes
import { ThemeProvider } from 'next-themes'

// No layout raiz
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>

// Componente de toggle
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button 
      variant="outline" 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Toggle Theme
    </Button>
  )
}
```

### 8.7 Responsividade

```tsx
// Padrão mobile-first
<div className={cn(
  "grid gap-4",
  "grid-cols-1",           // Mobile
  "md:grid-cols-2",        // Tablet
  "lg:grid-cols-3"         // Desktop
)}>

// Ocultar em mobile
<div className="hidden md:block">Desktop only</div>

// Mostrar apenas em mobile
<div className="md:hidden">Mobile only</div>

// Ajustar tamanhos
<Button size="sm" className="md:size-default lg:size-lg">
  Responsive
</Button>
```

---

## 9. Manutenção

### 9.1 Versionamento

O sistema segue **Semantic Versioning** (SemVer):

- **MAJOR**: Mudanças que quebram compatibilidade
- **MINOR**: Novos recursos compatíveis com versão anterior
- **PATCH**: Correções de bugs compatíveis

**Versão Atual**: 1.0.0

### 9.2 Atualização de Dependências

```bash
# Verificar atualizações
npm outdated

# Atualizar Radix UI
npm update @radix-ui/react-*

# Atualizar Tailwind CSS
npm update tailwindcss @tailwindcss/postcss

# Atualizar componentes via shadcn
npx shadcn@latest add button --overwrite
```

### 9.3 Testes

#### **Recomendações de Teste**

```tsx
// Teste de renderização
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toHaveTextContent('Click me')
})

// Teste de interação
import { fireEvent } from '@testing-library/react'

test('calls onClick when clicked', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click</Button>)
  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})

// Teste de acessibilidade
import { axe } from 'jest-axe'

test('has no accessibility violations', async () => {
  const { container } = render(<Button>Accessible</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### 9.4 Documentação de Novos Componentes

Ao adicionar um novo componente, documente:

```markdown
## ComponentName

**Descrição**: Breve descrição do propósito

**Variantes**: lista de variantes
**Tamanhos**: lista de tamanhos (se aplicável)

**Exemplo de Uso**:
```tsx
<ComponentName variant="default">Content</ComponentName>
```

**Props**:
- `prop1` (type): descrição
- `prop2` (type): descrição

**Acessibilidade**:
- ARIA roles utilizados
- Navegação por teclado
- Estados comunicados

**Notas**:
- Considerações especiais
- Compatibilidade
```

### 9.5 Checklist de Contribuição

Antes de adicionar/modificar componentes:

- [ ] Segue padrões de nomenclatura
- [ ] Usa `cn()` para merge de classes
- [ ] Implementa `data-slot` attribute
- [ ] Suporta prop `className`
- [ ] Tem variantes via CVA (se aplicável)
- [ ] É totalmente acessível (teclado + screen reader)
- [ ] Funciona em ambos os temas (claro/escuro)
- [ ] É responsivo (mobile-first)
- [ ] Props são type-safe
- [ ] Documentação atualizada
- [ ] Testes implementados

### 9.6 Performance

**Otimizações**:

- Usar Server Components por padrão
- Lazy load de componentes pesados:
  ```tsx
  const Chart = dynamic(() => import('@/components/ui/chart'), {
    loading: () => <Skeleton className="h-[300px]" />
  })
  ```
- Memoização para componentes complexos:
  ```tsx
  const MemoizedCard = React.memo(Card)
  ```
- Virtualização para listas longas (react-window)

### 9.7 Debugging

**Identificar componentes**:
```tsx
// Usar data-slot para inspecionar
document.querySelectorAll('[data-slot="button"]')
```

**Debug de estilos**:
```tsx
// Adicionar border temporário
<div className="border-2 border-red-500">
```

**Console logs em desenvolvimento**:
```tsx
if (process.env.NODE_ENV === 'development') {
  console.log('[v0] Component rendered', props)
}
```

### 9.8 Migração de Versões

Para atualizar de versões anteriores:

1. Ler changelog completo
2. Executar testes de regressão
3. Atualizar dependências gradualmente
4. Testar em ambiente de staging
5. Deploy incremental

### 9.9 Suporte e Comunidade

- **Issues**: Reporte bugs com reprodução mínima
- **Feature Requests**: Descreva caso de uso e benefícios
- **Contribuições**: Siga checklist de contribuição
- **Dúvidas**: Consulte documentação antes de abrir issue

---

## 10. Apêndices

### 10.1 Glossário

- **CVA**: Class Variance Authority - biblioteca para variantes de componentes
- **Radix UI**: Conjunto de primitivos headless para React
- **Server Component**: Componente React renderizado no servidor (Next.js 13+)
- **Client Component**: Componente React com interatividade client-side
- **ARIA**: Accessible Rich Internet Applications - especificação de acessibilidade
- **WCAG**: Web Content Accessibility Guidelines

### 10.2 Recursos Adicionais

**Documentação do Projeto**:
- [21_convencoes_nomenclatura.md](./20_ARCH/21_convencoes_nomenclatura.md) - Clean Code pt-BR
- [22_estrutura_projeto.md](./20_ARCH/22_estrutura_projeto.md) - Estrutura de pastas
- [20_tech_stack.md](./20_ARCH/20_tech_stack.md) - Stack tecnológica

**Recursos Externos**:
- [Radix UI Documentation](https://radix-ui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Next.js Documentation](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com)
- [ARIA Patterns](https://www.w3.org/WAI/ARIA/apg/)

### 10.3 Changelog

#### v1.0.0 (Janeiro 2026)
- ✨ Sistema inicial com 58 componentes
- ✨ Suporte completo a Next.js 16
- ✨ React 19.2 com useEffectEvent
- ✨ Tailwind CSS v4
- ✨ Tema Conecta com cores institucionais
- ✨ Documentação técnica completa

---

**Última Atualização**: Janeiro 2026  
**Versão do Sistema**: 1.0.0  
**Mantenedor**: Equipe Conecta Design System

Para sugestões ou contribuições, consulte o guia de contribuição ou abra uma issue no repositório.
