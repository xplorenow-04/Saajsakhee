import { useState, useEffect } from "react";
import { Save, Loader2, Truck, Clock, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_ENV === "production" ? import.meta.env.VITE_BACKEND_URL_PROD : import.meta.env.VITE_BACKEND_URL}/api/settings`;

export default function AdminSettings() {
  const [form, setForm] = useState({
    freeShippingThreshold: "",
    shippingCharge: "",
    processingDays: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(BASE_URL, { withCredentials: true });
        if (data.success) {
          setForm({
            freeShippingThreshold: data.data.freeShippingThreshold,
            shippingCharge: data.data.shippingCharge,
            processingDays: data.data.processingDays
          });
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (form.freeShippingThreshold === "" || isNaN(Number(form.freeShippingThreshold)) || Number(form.freeShippingThreshold) < 0) {
      toast.error("Free shipping threshold must be a valid non-negative number");
      return;
    }
    if (form.shippingCharge === "" || isNaN(Number(form.shippingCharge)) || Number(form.shippingCharge) < 0) {
      toast.error("Shipping charge must be a valid non-negative number");
      return;
    }
    if (!form.processingDays.trim()) {
      toast.error("Processing days cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const { data } = await axios.put(BASE_URL, form, { withCredentials: true });
      if (data.success) {
        toast.success("Settings saved successfully");
        setForm({
          freeShippingThreshold: data.data.freeShippingThreshold,
          shippingCharge: data.data.shippingCharge,
          processingDays: data.data.processingDays
        });
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-surface-800 rounded-xl animate-pulse" />
        <div className="h-64 bg-surface-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Shipping Settings</h1>
        <p className="text-sm text-text-muted mt-0.5">Configure shipping rates and delivery info shown to customers</p>
      </div>

      {/* Live Preview */}
      <div className="bg-surface-800 border border-gold-500/20 rounded-2xl p-5 space-y-3">
        <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-3">Preview — How customers see it</p>
        <div className="flex items-start gap-3">
          <Truck size={18} className="text-gold-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-text-primary">Free Shipping</p>
            <p className="text-xs text-text-muted">
              On orders above <span className="text-text-secondary font-medium">₹{form.freeShippingThreshold}</span>. Otherwise ₹{form.shippingCharge} delivery charge.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock size={18} className="text-gold-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-text-primary">Processing Time</p>
            <p className="text-xs text-text-muted">
              Orders are processed within <span className="text-text-secondary font-medium">{form.processingDays || "—"} business days</span>
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-surface-800 border border-surface-600 rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-text-primary">Edit Shipping Settings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
              <Truck size={14} className="text-text-muted" />
              Free Shipping Threshold (₹)
            </label>
            <input
              type="number"
              name="freeShippingThreshold"
              value={form.freeShippingThreshold}
              onChange={handleChange}
              min={0}
              step={1}
              placeholder="e.g. 999"
              className="w-full bg-surface-700 border border-surface-600 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all"
            />
            <p className="text-xs text-text-muted mt-1">Orders above this amount get free shipping</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
              <DollarSign size={14} className="text-text-muted" />
              Shipping Charge (₹)
            </label>
            <input
              type="number"
              name="shippingCharge"
              value={form.shippingCharge}
              onChange={handleChange}
              min={0}
              step={1}
              placeholder="e.g. 99"
              className="w-full bg-surface-700 border border-surface-600 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all"
            />
            <p className="text-xs text-text-muted mt-1">Charged when order is below free shipping threshold</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
            <Clock size={14} className="text-text-muted" />
            Processing Days
          </label>
          <input
            type="text"
            name="processingDays"
            value={form.processingDays}
            onChange={handleChange}
            placeholder="e.g. 3-5 or 2-3"
            className="w-full bg-surface-700 border border-surface-600 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all"
          />
          <p className="text-xs text-text-muted mt-1">Shown to customers as "Orders processed within X days"</p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600 text-obsidian-950 font-bold transition-all text-sm shadow-[0_4px_14px_rgba(212,175,55,0.3)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
