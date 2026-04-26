export default function Confidentialite() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-playfair text-charcoal">Politique de confidentialité</h1>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">1. Données collectées</h2>
        <p className="text-charcoal/70 text-sm leading-relaxed">
          Lors d'une commande, nous collectons : nom, adresse email, numéro de téléphone, adresse de livraison et pays. Ces données sont nécessaires au traitement de votre commande.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">2. Utilisation des données</h2>
        <p className="text-charcoal/70 text-sm leading-relaxed">
          Vos données sont utilisées exclusivement pour : le traitement de vos commandes, l'envoi de confirmations par email, et le suivi de livraison. Elles ne sont jamais revendues à des tiers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">3. Données bancaires</h2>
        <p className="text-charcoal/70 text-sm leading-relaxed">
          Aucune donnée bancaire n'est stockée sur nos serveurs. Le paiement est traité directement par SumUp, certifié PCI DSS.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">4. Durée de conservation</h2>
        <p className="text-charcoal/70 text-sm leading-relaxed">
          Vos données sont conservées 3 ans à compter de votre dernière commande, conformément aux obligations légales comptables.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">5. Vos droits (RGPD)</h2>
        <p className="text-charcoal/70 text-sm leading-relaxed">
          Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits : dressbymee@gmail.com
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">6. Cookies</h2>
        <p className="text-charcoal/70 text-sm leading-relaxed">
          Ce site utilise uniquement des cookies techniques indispensables au fonctionnement (panier, session). Aucun cookie publicitaire ou de tracking n'est utilisé.
        </p>
      </section>
    </div>
  )
}
