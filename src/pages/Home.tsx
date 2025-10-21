import { ArrowRight, Package, TrendingUp, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import heroBackground from "@/assets/hero-background.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 relative">
      {/* Abstract Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-16 lg:py-24 relative z-10">
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-sm font-semibold text-primary mb-2 backdrop-blur-sm">
            <Shield className="w-4 h-4" />
            <span>Sistem Manajemen Bahan Baku Berkualitas Tinggi</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight tracking-tight">
            Optimalkan Pasokan Anda
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Untuk Makanan Bergizi Gratis
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            Solusi lengkap untuk mengelola rantai pasokan bahan makanan dengan presisi dan efisiensi untuk program MBG.
          </p>
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>
          <div className="flex gap-4 justify-center pt-6">
            <Button asChild size="lg" className="gap-2 h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              <Link to="/products">
                Mulai Sekarang
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-semibold border-2 hover:bg-secondary/50">
              <Link to="/analytics">Lihat Analitik</Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:shadow-primary/30 transition-shadow">
              <Package className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">Manajemen Bahan Baku</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tambah, edit, dan kelola seluruh katalog bahan baku makanan dengan filter dan pencarian canggih.
            </p>
          </div>

          <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-accent/50">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:shadow-accent/30 transition-shadow">
              <TrendingUp className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">Analitik Real-time</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pantau tingkat persediaan dan performa bahan baku dengan dashboard analitik yang komprehensif.
            </p>
          </div>

          <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:shadow-primary/30 transition-shadow">
              <Users className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">Kolaborasi Tim</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bekerja sama dengan lancar menggunakan kontrol akses berbasis peran dan pelacakan aktivitas.
            </p>
          </div>

          <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-accent/50">
            <div className="w-14 h-14 bg-gradient-to-br from-muted-foreground to-muted-foreground/70 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:shadow-muted-foreground/30 transition-shadow">
              <Shield className="w-7 h-7 text-background" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">Aman & Andal</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Keamanan tingkat enterprise dengan cadangan otomatis, enkripsi, dan kepatuhan standar.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl p-16 text-primary-foreground shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-2">
              <p className="text-6xl md:text-7xl font-extrabold mb-3 tracking-tight">10K+</p>
              <p className="text-lg text-primary-foreground/90 font-medium">Bahan Baku Dikelola</p>
            </div>
            <div className="space-y-2">
              <p className="text-6xl md:text-7xl font-extrabold mb-3 tracking-tight">500+</p>
              <p className="text-lg text-primary-foreground/90 font-medium">Pengguna Aktif</p>
            </div>
            <div className="space-y-2">
              <p className="text-6xl md:text-7xl font-extrabold mb-3 tracking-tight">99.9%</p>
              <p className="text-lg text-primary-foreground/90 font-medium">Waktu Aktif</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
